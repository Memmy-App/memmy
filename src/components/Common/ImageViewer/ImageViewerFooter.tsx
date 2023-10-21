import React, { useCallback } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Save, Share } from '@tamagui/lucide-icons';
import { XStack, YStack } from 'tamagui';
import { saveImage } from '@helpers/image';
import { shareLink } from '@helpers/share/shareLink';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';

interface IProps {
  visible: boolean;
}

function ImageViewerFooter({ visible }: IProps): React.JSX.Element | null {
  const imageViewer = useImageViewer();

  if (!visible) return null;

  const onImageSave = useCallback(() => {
    void saveImage(imageViewer.params!.source!);
  }, [imageViewer.params?.source]);

  const onSharePress = useCallback(() => {
    void shareLink({
      title: imageViewer.params?.title ?? 'Image',
      link: imageViewer.params!.source!,
      isImage: true,
    });
  }, [imageViewer.params?.source]);

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
          <AnimatedIconButton
            icon={Save}
            color="white"
            iconSize={24}
            onPress={onImageSave}
          />
          <AnimatedIconButton
            icon={Share}
            color="white"
            iconSize={24}
            onPress={onSharePress}
          />
        </XStack>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(ImageViewerFooter);
