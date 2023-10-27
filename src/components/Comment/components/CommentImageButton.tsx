import React, { useCallback, useRef } from 'react';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';
import { saveImageDimensions, useImageSavedDimensions } from '@src/state';
import { IDimensions } from '@src/types';
import { Image, ImageLoadEventData } from 'expo-image';
import { View } from 'react-native';
import { XStack } from 'tamagui';

interface IProps {
  source: string;
  content?: string;
}

function CommentImageButton({ source, content }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);
  const viewerRef = useRef<View | undefined>();

  const onPress = useCallback(() => {
    // TODO We should handle this better later
    if (savedDimensions == null) return;

    imageViewer.setViewerRef?.(viewerRef);
    imageViewer.setParams?.({ source, title: content });
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
    <XStack onPress={onPress} hitSlop={3} borderRadius={10} m="$1">
      {/* @ts-expect-error this is valid */}
      <View ref={viewerRef}>
        <Image
          source={{ uri: source }}
          style={{
            height: 85,
            width: 105,
            borderRadius: 10,
          }}
          onLoad={onImageLoad}
          contentFit="contain"
        />
      </View>
    </XStack>
  );

  // return (
  //   <XStack
  //     backgroundColor="$bg"
  //     borderRadius={10}
  //     mt="$1"
  //     onPress={onPress}
  //     alignItems="center"
  //     space="$2"
  //     px="$3"
  //     pb="$2"
  //     pt="$2"
  //     justifyContent="space-between"
  //     flex={1}
  //     width="100%"
  //   >
  //     {/* @ts-expect-error this is valid */}
  //     <View ref={viewerRef}>
  //       <Image
  //         source={{ uri: source }}
  //         style={{
  //           height: 30,
  //           width: 40,
  //           borderRadius: 10,
  //         }}
  //         onLoad={onImageLoad}
  //       />
  //     </View>
  //     <Separator vertical borderColor="$secondary" height={20} opacity={0.5} />
  //     <XStack flex={1}>
  //       <Text color="$secondary" numberOfLines={1} fontSize="$2">
  //         {content != null && content !== '' ? content : source}
  //       </Text>
  //     </XStack>
  //     <ChevronRight color="$secondary" />
  //   </XStack>
  // );
}

export default React.memo(CommentImageButton);
