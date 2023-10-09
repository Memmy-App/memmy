import React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';

import tguiConfig from './tamagui.config';

export default function App(): React.JSX.Element {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tguiConfig}></TamaguiProvider>
    </GestureHandlerRootView>
  );
}
