import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import { Text } from 'tamagui';

interface IProps {
  visible: boolean;
  title: string;
}

function ImageViewerHeader({
  visible,
  title,
}: IProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <VStack
        zIndex={1}
        position="absolute"
        height={120}
        width="100%"
        backgroundColor="$upvote"
      >
        <HStack top={80} flex={1} paddingHorizontal="$3">
          <Text fontSize="$6" fontWeight="bold" numberOfLines={1}>
            {title}
          </Text>
        </HStack>
      </VStack>
    </Animated.View>
  );
}

export default React.memo(ImageViewerHeader);
