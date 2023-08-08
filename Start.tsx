import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { ErrorBoundary } from "react-error-boundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import { useAccountStore } from "@src/state/account/accountStore";
import { GluestackUIProvider } from "@src/components/gluestack";
import { ThemeOptionsMap } from "@src/theme/themeOptions";
import { useThemeConfig } from "@src/state/settings/settingsStore";
import ErrorView from "@src/components/common/ErrorView";
import Stack from "./Stack";

const logError = (e: any, info: any) => {
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

function Start({ onReady }: StartProps): React.JSX.Element {
  // const [loaded, setLoaded] = useState(false);
  const [stackReady, setStackReady] = useState(false);
  const accountStore = useAccountStore();

  const [statusBarColor] = useState<StatusBarStyle>("dark");

  // const currentTheme = useCurrentTheme();

  const glueStackTheme = useThemeConfig();

  // Temporary hack for RN issue. TODO Fix this once patched
  // https://github.com/facebook/react-native/issues/35972#issuecomment-1416243681
  // const colorScheme = useColorScheme();
  // const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme);
  // const onColorSchemeChange = useRef<NodeJS.Timeout>();

  // Add a second delay before switching color scheme
  // Cancel if color scheme immediately switches back
  // useEffect(() => {
  //   if (colorScheme !== currentColorScheme) {
  //     onColorSchemeChange.current = setTimeout(() => {
  //       setSetting({ colorScheme }).then();
  //       setCurrentColorScheme(colorScheme);
  //     }, 1000);
  //   } else if (onColorSchemeChange.current) {
  //     clearTimeout(onColorSchemeChange.current);
  //   }
  // }, [colorScheme]);
  //
  // const appState = useRef(AppState.currentState);

  // let refreshInterval;

  const onStackReady = () => {
    setStackReady(true);
  };

  useEffect(() => {
    if (!accountStore.status.loading && stackReady) {
      onReady();
    }
  }, [accountStore.status.loading, stackReady]);

  // useEffect(() => {
  //   if (!loaded) return;
  //
  //   startInterval();
  //
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active" &&
  //       !refreshInterval
  //     ) {
  //       writeToLog("Starting refresh interval.");
  //       startInterval();
  //     } else if (
  //       appState.current === "active" &&
  //       nextAppState.match(/inactive|background/)
  //     ) {
  //       writeToLog("Ending refresh interval.");
  //       clearInterval(refreshInterval);
  //       refreshInterval = null;
  //     }
  //
  //     appState.current = nextAppState;
  //   });
  //
  //   // eslint-disable-next-line consistent-return
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [loaded]);
  //
  // const startInterval = () => {
  //   refreshInterval = setInterval(() => {
  //     if (lemmyInstance && lemmyAuthToken) {
  //       dispatch(getUnreadCount());
  //     }
  //   }, 30000);
  // };

  // useEffect(() => {
  //   setStatusBarColor(
  //     ThemeOptionsMap[currentTheme].config.initialColorMode === "dark"
  //       ? "light"
  //       : "dark"
  //   );
  //
  //   setRootViewBackgroundColor(ThemeOptionsMap[currentTheme].colors.bg);
  // }, [currentTheme, currentColorScheme]);

  // if (!loaded) {
  //   useAccountStore.getState().init();
  //   dispatch(loadFavorites());
  //   setLoaded(true);
  //   loadSettings().then();
  //   useFiltersStore.getState().init();
  // }
  //
  // if (accountStore.status.loading) {
  //   return null;
  // }

  return (
    <GluestackUIProvider config={glueStackTheme}>
      <ErrorBoundary onError={logError} FallbackComponent={ErrorView}>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style={statusBarColor} />
        <GestureHandlerRootView
          style={{
            flex: 1,
            backgroundColor: ThemeOptionsMap.Dracula.colors.bg,
          }}
        >
          <>
            {/* <Toast /> */}
            <Stack onReady={onStackReady} />
          </>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </GluestackUIProvider>
  );
}

export default Start;
