import 'react-native-reanimated';

import React, { useEffect, useMemo } from 'react';
import { TamaguiProvider, Text, Theme, useTheme } from 'tamagui';

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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeSettings } from '@hooks/useThemeSettings';
import AppToast from '@components/Common/Toast/AppToast';

import { Drawer as RNDrawer } from 'react-native-drawer-layout';
import Drawer from '@components/Common/Drawer/Drawer';
import {
  setDrawerOpen,
  useAccent,
  useAccountStore,
  useAppUpgraded,
  useDrawerOpen,
  useSettingsStore,
} from '@src/state';
import {
  DarkTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

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
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  const themeSettings = useThemeSettings();

  const upgraded = useAppUpgraded();

  const resetAccountStore = useAccountStore((state) => state.reset);
  const resetSettingsStore = useSettingsStore((state) => state.reset);

  if (!loaded || !themeSettings.initialized) return null;

  if (upgraded == null || !upgraded) {
    resetAccountStore();
    resetSettingsStore();

    useSettingsStore.setState((state) => {
      state.upgraded = true;
    });
  }

  return (
    <ErrorBoundary
      fallback={<Text>Something went wrong</Text>}
      onError={(e) => {
        writeToLog(JSON.stringify(e));
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={tguiConfig}>
          {/* @ts-expect-error - valid */}
          <Theme name={themeSettings.theme}>
            <PartTwo />
          </Theme>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const setClosed = (): void => {
  setDrawerOpen(false);
};

const setOpen = (): void => {
  setDrawerOpen(true);
};

function PartTwo(): React.JSX.Element {
  const drawerOpen = useDrawerOpen();

  const theme = useTheme();
  const accent = useAccent();

  const navTheme: Theme = useMemo(
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

  const navRef = useNavigationContainerRef();

  return (
    <>
      {/* @ts-expect-error - This is a valid option */}
      <StatusBar style={theme.statusBar.val} />

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
          <NavigationContainer theme={navTheme} ref={navRef}>
            <Stack />
          </NavigationContainer>
        </ImageViewerProvider>
      </RNDrawer>
    </>
  );
}
