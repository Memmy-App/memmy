import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import Animated, { FadeOut } from 'react-native-reanimated';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

export default function LoadingScreen(): React.JSX.Element {
  return (
    <Animated.View exiting={FadeOut} style={{ flex: 1 }}>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <LoadingAnimation size="normal" />
      </VStack>
    </Animated.View>
  );
}
