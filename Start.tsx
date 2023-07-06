import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, extendTheme } from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppState, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import merge from "deepmerge";
import Stack from "./Stack";
import MemmyErrorView from "./components/ui/Loading/MemmyErrorView";
import { writeToLog } from "./helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "./lemmy/LemmyInstance";
import { loadAccounts } from "./slices/accounts/accountsActions";
import { selectAccountsLoaded } from "./slices/accounts/accountsSlice";
import { loadSettings, setSetting } from "./slices/settings/settingsActions";
import { selectSettings } from "./slices/settings/settingsSlice";
import { getUnreadCount } from "./slices/site/siteActions";
import { useAppDispatch, useAppSelector } from "./store";
import getFontScale from "./theme/fontSize";
import { darkTheme } from "./theme/theme";
import { ThemeOptionsArr, ThemeOptionsMap } from "./theme/themeOptions";
import Toast from "./components/ui/Toast";
import { systemFontSettings } from "./theme/common";

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

function Start() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const accountsLoaded = useAppSelector(selectAccountsLoaded);

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
  const systemColorScheme = useColorScheme();
  const currentTheme = themeMatchSystem
    ? systemColorScheme === "light"
      ? themeLight
      : themeDark
    : theme;

  const appState = useRef(AppState.currentState);

  let refreshInterval;

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
    // ! fontSize has to be here
  }, [
    currentTheme,
    fontSize,
    getFontScale,
    isSystemTextSize,
    isSystemFont,
    accentColor,
  ]);

  const ThemedStatusBar = useMemo(
    () => <StatusBar style={theme === "Light" ? "dark" : "light"} />,
    [theme]
  );

  if (!loaded) {
    dispatch(loadSettings());
    dispatch(loadAccounts());
    setLoaded(true);
  }

  if (!accountsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={selectedTheme}>
      <ErrorBoundary onError={logError} FallbackComponent={MemmyErrorView}>
        {/* eslint-disable-next-line react/style-prop-object */}
        {ThemedStatusBar}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <>
              <Toast />
              <Stack />
            </>
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </NativeBaseProvider>
  );
}

export default Start;
