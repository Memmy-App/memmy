import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Save, Share } from '@tamagui/lucide-icons';
import { XStack, YStack } from 'tamagui';

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
      <YStack
        zIndex={1}
        position="absolute"
        height={100}
        width="100%"
        bottom={0}
        backgroundColor="rgba(0,0,0,0.5)"
      >
        <XStack flex={1} px="$5" py="$3" justifyContent="space-between">
          <AnimatedIconButton icon={Save} color="$accent" iconSize={24} />
          <AnimatedIconButton icon={Share} color="$accent" iconSize={24} />
        </XStack>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(ImageViewerFooter);
