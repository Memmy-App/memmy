import React from 'react';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Spinner, YStack } from 'tamagui';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';
import { useMouseLoadingIcon } from '@src/state';

export default function LoadingScreen(): React.JSX.Element {
  const mouse = useMouseLoadingIcon();

  return (
    <Animated.View exiting={FadeOut} style={{ flex: 1 }}>
      <YStack flex={1} justifyContent="center" alignItems="center">
        {mouse ? (
          <LoadingAnimation size="normal" />
        ) : (
          <Spinner color="$accent" size="large" />
        )}
      </YStack>
    </Animated.View>
  );
}
