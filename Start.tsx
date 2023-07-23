import * as Notifications from "expo-notifications";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { extendTheme, NativeBaseProvider } from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppState, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import merge from "deepmerge";
import { setRootViewBackgroundColor } from "@pnthach95/react-native-root-view-background";
import { GluestackUIProvider } from "./src/components/common/Gluestack";
import { config } from "./gluestack-ui.config";
import Stack from "./Stack";
import MemmyErrorView from "./src/components/common/Loading/MemmyErrorView";
import { writeToLog } from "./src/helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "./src/LemmyInstance";
import { loadAccounts } from "./src/slices/accounts/accountsActions";
import { selectAccountsLoaded } from "./src/slices/accounts/accountsSlice";
import {
  loadSettings,
  setSetting,
} from "./src/slices/settings/settingsActions";
import { selectSettings } from "./src/slices/settings/settingsSlice";
import { getUnreadCount } from "./src/slices/site/siteActions";
import { useAppDispatch, useAppSelector } from "./store";
import getFontScale from "./src/theme/fontSize";
import { darkTheme } from "./src/theme/theme";
import { ThemeOptionsArr, ThemeOptionsMap } from "./src/theme/themeOptions";
import Toast from "./src/components/common/Toast";
import { systemFontSettings } from "./src/theme/common";
import { loadFavorites } from "./src/slices/favorites/favoritesActions";
import { useFiltersStore } from "./src/stores/filters/filtersStore";

const logError = (e, info) => {
  writeToLog(e.toString());
  writeToLog(
    info && info.componentStack ? info.componentStack.toString() : "No stack."
  );
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface StartProps {
  onReady: () => void;
}

function Start({ onReady }: StartProps) {
  const [loaded, setLoaded] = useState(false);
  const [stackReady, setStackReady] = useState(false);
  const dispatch = useAppDispatch();
  const accountsLoaded = useAppSelector(selectAccountsLoaded);

  const [statusBarColor, setStatusBarColor] = useState<StatusBarStyle>("dark");

  const {
    theme,
    themeMatchSystem,
    themeDark,
    themeLight,
    fontSize,
    isSystemTextSize,
    isSystemFont,
    accentColor,
  } = useAppSelector(selectSettings);

  const [selectedTheme, setSelectedTheme] = useState<any>(darkTheme);

  // Temporary hack for RN issue. TODO Fix this once patched
  // https://github.com/facebook/react-native/issues/35972#issuecomment-1416243681
  const colorScheme = useColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme);
  const onColorSchemeChange = useRef<NodeJS.Timeout>();

  // Add a second delay before switching color scheme
  // Cancel if color scheme immediately switches back
  useEffect(() => {
    if (colorScheme !== currentColorScheme) {
      onColorSchemeChange.current = setTimeout(
        () => setCurrentColorScheme(colorScheme),
        1000
      );
    } else if (onColorSchemeChange.current) {
      clearTimeout(onColorSchemeChange.current);
    }
  }, [colorScheme]);

  const currentTheme = useMemo(
    () =>
      themeMatchSystem
        ? currentColorScheme === "light"
          ? themeLight
          : themeDark
        : theme,
    [themeMatchSystem, themeDark, themeLight, theme, currentColorScheme]
  );

  const appState = useRef(AppState.currentState);

  let refreshInterval;

  const onStackReady = () => {
    setStackReady(true);
  };

  useEffect(() => {
    if (accountsLoaded && stackReady) {
      onReady();
    }
  }, [accountsLoaded, stackReady]);

  useEffect(() => {
    if (!loaded) return;

    startInterval();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        !refreshInterval
      ) {
        writeToLog("Starting refresh interval.");
        startInterval();
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        writeToLog("Ending refresh interval.");
        clearInterval(refreshInterval);
        refreshInterval = null;
      }

      appState.current = nextAppState;
    });

    // eslint-disable-next-line consistent-return
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  const startInterval = () => {
    refreshInterval = setInterval(() => {
      if (lemmyInstance && lemmyAuthToken) {
        dispatch(getUnreadCount());
      }
    }, 30000);
  };

  useEffect(() => {
    let usedTheme = currentTheme;

    // @ts-ignore
    if (!ThemeOptionsArr.includes(usedTheme)) {
      usedTheme = "Dark";

      dispatch(setSetting({ theme: usedTheme }));
    }

    const newTheme = extendTheme(
      merge.all([
        ThemeOptionsMap[usedTheme],
        accentColor
          ? {
              colors: {
                app: {
                  accent: accentColor,
                },
              },
            }
          : {},
        {
          components: {
            Text: {
              defaultProps: {
                color: ThemeOptionsMap[usedTheme].colors.app.textPrimary,
              },
            },
          },
        },
        isSystemTextSize
          ? {
              components: {
                Text: {
                  defaultProps: {
                    allowFontScaling: false,
                  },
                },
              },
            }
          : { fontSizes: getFontScale() },
        isSystemFont ? systemFontSettings : {},
      ])
    );
    // TODO add fallback
    setSelectedTheme(newTheme);
    setStatusBarColor(
      newTheme.config.initialColorMode === "dark" ? "light" : "dark"
    );

    setRootViewBackgroundColor(ThemeOptionsMap[usedTheme].colors.app.bg);
    // ! fontSize has to be here
  }, [
    currentTheme,
    fontSize,
    getFontScale,
    isSystemTextSize,
    isSystemFont,
    accentColor,
  ]);

  if (!loaded) {
    dispatch(loadSettings());
    dispatch(loadAccounts());
    dispatch(loadFavorites());
    setLoaded(true);
    useFiltersStore.getState().init();
  }

  if (!accountsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider config={config.theme}>
      <NativeBaseProvider theme={selectedTheme}>
        <ErrorBoundary onError={logError} FallbackComponent={MemmyErrorView}>
          {/* eslint-disable-next-line react/style-prop-object */}
          <StatusBar style={statusBarColor} />
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: selectedTheme.colors.app.bg }}
          >
            <>
              <Toast />
              <Stack onReady={onStackReady} />
            </>
          </GestureHandlerRootView>
        </ErrorBoundary>
      </NativeBaseProvider>
    </GluestackUIProvider>
  );
}

export default Start;
