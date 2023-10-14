import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  });

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tguiConfig}>
        <Theme name="darkTheme">
          <PartTwo />
        </Theme>
      </TamaguiProvider>
    </GestureHandlerRootView>
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
