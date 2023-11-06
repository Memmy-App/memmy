import React, { useCallback } from 'react';
import { XStack } from 'tamagui';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { Save, Share } from '@tamagui/lucide-icons';
import { useImageViewer } from 'expo-image-viewer';
import { saveImage } from '@helpers/image';
import { shareLink } from '@helpers/share/shareLink';

export default function ImageViewerFooter(): React.JSX.Element {
  const imageViewer = useImageViewer();

  const onImageSave = useCallback(() => {
    void saveImage(imageViewer.state.params.source as string);
  }, [imageViewer.state.params.source]);

  const onSharePress = useCallback(() => {
    void shareLink({
      title: imageViewer.state.params.title ?? 'Image',
      link: imageViewer.state.params.source as string,
      isImage: true,
    });
  }, [imageViewer.state.params.source]);

  return (
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
  );
}
