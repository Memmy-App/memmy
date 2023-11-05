import 'react-native-gesture-handler';
import 'react-native-reanimated';

import '@src/plugins/dayjs';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TamaguiProvider, Theme, useTheme } from 'tamagui';

import tguiConfig from './tamagui.config';
import Stack from '@components/Navigation/Stack';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { enableMapSet } from 'immer';
import ImageViewerProvider from '@components/Common/ImageViewer/ImageViewerProvider';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from 'react-error-boundary';
import { writeToLog } from '@src/helpers';
import { useThemeSettings } from '@hooks/useThemeSettings';
import AppToast from '@components/Common/Toast/AppToast';

import { Drawer as RNDrawer } from 'react-native-drawer-layout';
import Drawer from '@components/Common/Drawer/Drawer';
import {
  setDrawerOpen,
  useAccent,
  useAccountStore,
  useAppUpgraded,
  useCurrentAccount,
  useDrawerOpen,
  useIsAppLoading,
  useSettingsStore,
} from '@src/state';
import {
  DarkTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useBackgroundChecks } from '@hooks/useBackgroundChecks';
import { resetState } from '@src/state/resetState';
import ErrorScreen from '@components/Error/ErrorScreen';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { useNotificationsObserver } from '@hooks/useNotificationsObserver';

if (__DEV__) {
  require('./ReactotronConfig');
}

enableMapSet();
enableScreens();

void SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs(true);

export default function App(): React.JSX.Element | null {
  enableFreeze(true);

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    InterSemiBold: require('@tamagui/font-inter/otf/Inter-SemiBold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      writeToLog('Memmy has been initialized.');
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  const themeSettings = useThemeSettings();

  const upgraded = useAppUpgraded();

  useBackgroundChecks();

  const resetAccountStore = useAccountStore((state) => state.reset);
  const resetSettingsStore = useSettingsStore((state) => state.reset);

  if (!loaded || !themeSettings.initialized) return null;

  // TODO Eventually remove this
  if (upgraded == null || !upgraded) {
    resetAccountStore();
    resetSettingsStore();

    useSettingsStore.setState((state) => {
      state.upgraded = true;
    });
  }

  return (
    <TamaguiProvider config={tguiConfig}>
      <ErrorBoundary
        fallback={<ErrorScreen />}
        onError={(e) => {
          writeToLog(e.name);
          writeToLog(e.message);
          writeToLog(e.stack ?? 'No stack');
        }}
      >
        {/* @ts-expect-error - valid */}
        <Theme name={themeSettings.theme}>
          <PartTwo />
        </Theme>
      </ErrorBoundary>
    </TamaguiProvider>
  );
}

const setClosed = (): void => {
  setDrawerOpen(false);
};

const setOpen = (): void => {
  setDrawerOpen(true);
};

function PartTwo(): React.JSX.Element {
  // Drawer opening
  const drawerOpen = useDrawerOpen();

  // App wide loading modal
  const isAppLoading = useIsAppLoading();

  // Theme information
  const theme = useTheme();
  const accent = useAccent();

  // Current account
  const currentAccount = useCurrentAccount();

  // Create the theme for the navigation container.
  const navTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: accent ?? theme.accent.val,
        background: theme.bg.val,
        card: theme.navBarBg.val,
        text: theme.color.val,
        border: theme.border.val,
      },
    }),
    [theme],
  );

  // Create a ref for navigation
  const navRef = useNavigationContainerRef();

  // Handle notification redirects
  useNotificationsObserver(navRef);

  /* This is a little trick to completely reset our stack whenever we change accounts.
     We don't want to have any remnant of leftover screens because the IDs for posts, profiles,
     will be incorrect. We also will reset most of the stores here so we have a fresh, clean slate.
     Ensuring that everything is clear *before* the switch, we will do a timeout of 300ms before we actually flip
     the key
   */
  const initialized = useRef(false);

  const [key, setKey] = useState(1);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    resetState();

    setTimeout(() => {
      setKey((prev) => (prev === 1 ? 0 : 1));
    }, 300);
  }, [currentAccount]);

  return (
    <>
      {/* @ts-expect-error - This is a valid option */}
      <StatusBar style={theme.statusBar.val} />

      {/* A global loading overlay to use throughout the app */}
      <LoadingOverlay visible={isAppLoading} />

      <RNDrawer
        open={drawerOpen}
        onOpen={setOpen}
        onClose={setClosed}
        renderDrawerContent={() => <Drawer navigation={navRef} />}
        drawerStyle={{
          flex: 1,
          backgroundColor: 'black',
          width: '80%',
        }}
        swipeEnabled={false}
      >
        <ImageViewerProvider>
          <AppToast />
          <NavigationContainer theme={navTheme} ref={navRef} key={key}>
            <Stack />
          </NavigationContainer>
        </ImageViewerProvider>
      </RNDrawer>
    </>
  );
}
