import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';

import tguiConfig from './tamagui.config';
import Stack from '@components/Navigation/Stack';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { enableMapSet } from 'immer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Infinity } from '@tamagui/lucide-icons';
import ImageViewerProvider from '@components/Common/ImageViewer/ImageViewerProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // @ts-expect-error - This is a valid option
      staleTime: Infinity,
    },
  },
});

enableMapSet();
enableScreens();

void SplashScreen.preventAutoHideAsync();

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
        <QueryClientProvider client={queryClient}>
          <Theme name="darkTheme">
            <ImageViewerProvider>
              <Stack />
            </ImageViewerProvider>
          </Theme>
        </QueryClientProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
