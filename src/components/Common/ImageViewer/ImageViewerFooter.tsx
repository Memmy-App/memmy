import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Save, Share } from '@tamagui/lucide-icons';

interface IProps {
  visible: boolean;
  source: string | undefined;
}

function ImageViewerFooter({
  visible,
  source,
}: IProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <VStack
        zIndex={1}
        position="absolute"
        height={100}
        width="100%"
        bottom={0}
        backgroundColor="black"
      >
        <HStack
          flex={1}
          paddingHorizontal="$5"
          paddingVertical="$3"
          justifyContent="space-between"
        >
          <AnimatedIconButton icon={Save} color="$accent" iconSize={24} />
          <AnimatedIconButton icon={Share} color="$accent" iconSize={24} />
        </HStack>
      </VStack>
    </Animated.View>
  );
}

export default React.memo(ImageViewerFooter);
