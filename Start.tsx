import * as Notifications from "expo-notifications";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppState, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setRootViewBackgroundColor } from "@pnthach95/react-native-root-view-background";
import {
  useSettingsStore,
  useThemeConfig,
} from "@src/stores/settings/settingsStore";
import { GluestackUIProvider } from "@src/components/common/Gluestack";
import { writeToLog } from "@src/helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { loadAccounts } from "@src/slices/accounts/accountsActions";
import { selectAccountsLoaded } from "@src/slices/accounts/accountsSlice";
import { getUnreadCount } from "@src/slices/site/siteActions";
import { ThemeOptionsArr, ThemeOptionsMap } from "@src/theme/themeOptions";
import { loadFavorites } from "@src/slices/favorites/favoritesActions";
import { useFiltersStore } from "@src/stores/filters/filtersStore";
import loadSettings from "@src/stores/settings/actions/loadSettings";
import setSetting from "@src/stores/settings/actions/setSetting";
import { useAppDispatch, useAppSelector } from "./store";
import getFontScale from "./src/theme/fontSize";
import Toast from "./src/components/common/Toast";
import MemmyErrorView from "./src/components/common/Loading/MemmyErrorView";
import Stack from "./Stack";

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

  const { theme, isSystemFont, accentColor } = useSettingsStore((state) => ({
    theme: state.settings.theme,
    isSystemFont: state.settings.isSystemFont,
    accentColor: state.settings.accentColor,
  }));

  const currentTheme = useSettingsStore((state) => state.settings.theme);

  const glueStackTheme = useThemeConfig();

  // Temporary hack for RN issue. TODO Fix this once patched
  // https://github.com/facebook/react-native/issues/35972#issuecomment-1416243681
  const colorScheme = useColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme);
  const onColorSchemeChange = useRef<NodeJS.Timeout>();

  // Add a second delay before switching color scheme
  // Cancel if color scheme immediately switches back
  useEffect(() => {
    if (colorScheme !== currentColorScheme) {
      onColorSchemeChange.current = setTimeout(() => {
        setSetting({ colorScheme }).then();
        setCurrentColorScheme(colorScheme);
      }, 1000);
    } else if (onColorSchemeChange.current) {
      clearTimeout(onColorSchemeChange.current);
    }
  }, [colorScheme]);

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

      setSetting({ theme: usedTheme }).then();
    }

    // TODO: Disabling Font Scaling for now
    // const newTheme = merge.all([
    //   isSystemTextSize
    //     ? {
    //         components: {
    //           Text: {
    //             defaultProps: {
    //               allowFontScaling: false,
    //             },
    //           },
    //         },
    //       }
    //     : { fontSizes: getFontScale() },
    //   isSystemFont ? systemFontSettings : {},
    // ]);

    // // TODO add fallback
    setStatusBarColor(
      ThemeOptionsMap[usedTheme].config.initialColorMode === "dark"
        ? "light"
        : "dark"
    );

    setRootViewBackgroundColor(ThemeOptionsMap[usedTheme].colors.bg);
    // TODO: fontSize has to be here
  }, [currentTheme, getFontScale, isSystemFont, accentColor]);

  if (!loaded) {
    dispatch(loadAccounts());
    dispatch(loadFavorites());
    setLoaded(true);
    loadSettings().then();
    useFiltersStore.getState().init();
  }

  if (!accountsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider config={glueStackTheme}>
      <ErrorBoundary onError={logError} FallbackComponent={MemmyErrorView}>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style={statusBarColor} />
        <GestureHandlerRootView
          style={{
            flex: 1,
            backgroundColor: ThemeOptionsMap[theme].colors.bg,
          }}
        >
          <>
            <Toast />
            <Stack onReady={onStackReady} />
          </>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </GluestackUIProvider>
  );
}

export default Start;
