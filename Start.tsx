import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Stack from "./Stack";
import MemmyErrorView from "./components/ui/Loading/MemmyErrorView";
import { writeToLog } from "./helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "./lemmy/LemmyInstance";
import { loadAccounts } from "./slices/accounts/accountsActions";
import { selectAccountsLoaded } from "./slices/accounts/accountsSlice";
import { loadSettings } from "./slices/settings/settingsActions";
import { selectSettings } from "./slices/settings/settingsSlice";
import { getUnreadCount } from "./slices/site/siteActions";
import { useAppDispatch, useAppSelector } from "./store";
import { ThemeOptionsMap } from "./theme/ThemeOptions";

const logError = (e, info) => {
  writeToLog(e.toString());
  writeToLog(
    info && info.componentStack ? info.componentStack.toString() : "No stack."
  );
};

function Start() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const accountsLoaded = useAppSelector(selectAccountsLoaded);
  const { theme } = useAppSelector(selectSettings);
  const [selectedTheme, setSelectedTheme] = useState<any>(
    ThemeOptionsMap.Brown
  );

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

    return () => {
      subscription.remove();
    };
  }, [loaded]);

  const startInterval = () => {
    console.log("starting an interval.");
    refreshInterval = setInterval(() => {
      console.log("Looking for updates...");
      if (lemmyInstance && lemmyAuthToken) {
        dispatch(getUnreadCount());
      }
    }, 30000);
  };

  useEffect(() => {
    setSelectedTheme(ThemeOptionsMap[theme] || ThemeOptionsMap.Brown);
  }, [theme]);

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
        <StatusBar style={theme === "Light" ? "dark" : "light"} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ActionSheetProvider>
            <Stack />
          </ActionSheetProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </NativeBaseProvider>
  );
}

export default Start;
