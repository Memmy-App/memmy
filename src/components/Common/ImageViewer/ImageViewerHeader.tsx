import React, { useCallback } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, View, XStack, YStack } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';

interface IProps {
  visible: boolean;
  title: string;
}

function ImageViewerHeader({
  visible,
  title,
}: IProps): React.JSX.Element | null {
  const imageViewer = useImageViewer();

  const onExitPress = useCallback(() => {
    imageViewer.setVisible!(false);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <YStack
        zIndex={1}
        position="absolute"
        height={120}
        width="100%"
        backgroundColor="$upvote"
      >
        <XStack top={80} flex={1} px="$3">
          <Text fontSize="$6" fontWeight="bold" numberOfLines={1}>
            {title}
          </Text>
        </XStack>
      </YStack>
      <YStack zIndex={2} position="absolute" height={120} width="100%">
        <View top={60} ml="auto" pr="$3">
          <AnimatedIconButton
            icon={X}
            color="$accent"
            iconSize={28}
            onPress={onExitPress}
          />
        </View>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(ImageViewerHeader);
