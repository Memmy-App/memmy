import React, { useCallback, useRef } from 'react';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';
import { saveImageDimensions, useImageSavedDimensions } from '@src/state';
import { IDimensions } from '@src/types';
import { Image, ImageLoadEventData } from 'expo-image';
import { Separator, Text, XStack } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { View } from 'react-native';

interface IProps {
  source: string;
}

function CommentImageButton({ source }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);
  const viewerRef = useRef<View | undefined>();

  const onPress = useCallback(() => {
    // TODO We should handle this better later
    if (savedDimensions == null) return;

    imageViewer.setViewerRef?.(viewerRef);
    imageViewer.setParams?.({ source });
    imageViewer.setVisible?.(true);
    imageViewer.setDimensions?.(
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
    <XStack backgroundColor="$bg" borderRadius={10} mt="$1" onPress={onPress}>
      <XStack
        alignItems="center"
        space="$2"
        px="$3"
        pb="$2"
        pt="$2"
        justifyContent="space-between"
        flex={1}
      >
        {/* @ts-expect-error this is valid */}
        <View ref={viewerRef}>
          <Image
            source={{ uri: source }}
            style={{
              height: 30,
              width: 40,
              borderRadius: 10,
            }}
            onLoad={onImageLoad}
          />
        </View>
        <Separator
          vertical
          borderColor="$secondary"
          height={20}
          opacity={0.5}
        />
        <XStack flex={1}>
          <Text color="$secondary" numberOfLines={1} fontSize="$2">
            {source}
          </Text>
        </XStack>
        <ChevronRight color="$secondary" />
      </XStack>
    </XStack>
  );
}

export default React.memo(CommentImageButton);
