import React, { useCallback } from 'react';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';
import { saveImageDimensions, useImageSavedDimensions } from '@src/state';
import { IDimensions } from '@src/types';
import { Image, ImageLoadEventData } from 'expo-image';
import { Separator, Text, View } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import HStack from '@components/Common/Stack/HStack';

interface IProps {
  source: string;
}

function CommentImageButton({ source }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);

  const onPress = useCallback(() => {
    if (imageViewer.setParams == null || imageViewer.setVisible == null) return;

    imageViewer.setParams({ source });
    imageViewer.setVisible(true);
    imageViewer.setDimensions!(
      savedDimensions?.dimensions as unknown as IDimensions,
    );
  }, [source, savedDimensions]);

  const onImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      const dimensions = {
        height: e.source.height,
        width: e.source.width,
      };

      if (savedDimensions != null) return;

      saveImageDimensions(source, { dimensions });
    },
    [savedDimensions],
  );

  return (
    <HStack
      backgroundColor="$bg"
      borderRadius={10}
      marginTop="$1"
      onPress={onPress}
    >
      <HStack
        alignItems="center"
        space="$2"
        paddingHorizontal="$3"
        paddingBottom="$2"
        paddingTop="$2"
        justifyContent="space-between"
        flex={1}
      >
        <Image
          source={{ uri: source }}
          style={{
            height: 30,
            width: 40,
            borderRadius: 10,
          }}
          onLoad={onImageLoad}
        />
        <Separator
          vertical
          borderColor="$secondary"
          height={20}
          opacity={0.5}
        />
        <View flex={1}>
          <Text color="$secondary" numberOfLines={1} fontSize="$2">
            {source}
          </Text>
        </View>
        <ChevronRight color="$secondary" />
      </HStack>
    </HStack>
  );
}

export default React.memo(CommentImageButton);
