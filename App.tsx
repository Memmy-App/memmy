import 'react-native-reanimated';

import React, { useEffect } from 'react';
import {
  TamaguiProvider,
  Text,
  Theme,
  updateTheme,
  useForceUpdate,
  useIsomorphicLayoutEffect,
  useTheme,
} from 'tamagui';

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
import { lightThemeColors } from '@src/theme/light';
import { useAccent } from '@src/state/settings/settingsStore';

if (__DEV__) {
  require('./ReactotronConfig');
}

enableMapSet();
enableScreens();

void SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs(true);

export default function App(): React.JSX.Element | null {
  enableFreeze(true);

  const accent = useAccent();

  const update = useForceUpdate();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
  });

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useIsomorphicLayoutEffect(() => {
    updateTheme({
      name: 'lightTheme',
      theme: {
        accent: accent ?? lightThemeColors.accent,
      },
    });
    update();
  }, [accent]);

  if (!loaded) return null;

  return (
    <ErrorBoundary
      fallback={<Text>Something went wrong</Text>}
      onError={(e) => {
        writeToLog(JSON.stringify(e));
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={tguiConfig}>
          <Theme name="lightTheme">
            <PartTwo />
          </Theme>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

function PartTwo(): React.JSX.Element {
  const theme = useTheme();

  return (
    <>
      {/* @ts-expect-error - This is a valid option */}
      <StatusBar style={theme.statusBar.val} />
      <ImageViewerProvider>
        <Stack />
      </ImageViewerProvider>
    </>
  );
}
