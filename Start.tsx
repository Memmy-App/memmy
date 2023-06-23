import React, { useEffect, useRef, useState } from "react";
import { NativeBaseProvider } from "native-base";
import { ErrorBoundary } from "react-error-boundary";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AppState } from "react-native";
import MemmyErrorView from "./components/ui/Loading/MemmyErrorView";
import Stack from "./Stack";
import { writeToLog } from "./helpers/LogHelper";
import { useAppDispatch, useAppSelector } from "./store";
import { loadSettings } from "./slices/settings/settingsActions";
import { loadAccounts } from "./slices/accounts/accountsActions";
import { selectAccountsLoaded } from "./slices/accounts/accountsSlice";
import { selectSettings } from "./slices/settings/settingsSlice";
import { brownTheme, darkTheme, lightTheme, purpleTheme } from "./theme/theme";
import { getUnreadCount } from "./slices/site/siteActions";
import { lemmyAuthToken, lemmyInstance } from "./lemmy/LemmyInstance";

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
  const [selectedTheme, setSelectedTheme] = useState<any>(brownTheme);

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
    switch (theme) {
      case "Light":
        setSelectedTheme(lightTheme);
        break;
      case "Dark":
        setSelectedTheme(darkTheme);
        break;
      case "Purple":
        setSelectedTheme(purpleTheme);
        break;
      case "Brown":
        setSelectedTheme(brownTheme);
        break;
      default:
        setSelectedTheme(brownTheme);
        break;
    }
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
