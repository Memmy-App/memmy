import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { useImageViewer } from './ImageViewerProvider';
import {
  saveImageDimensions,
  setPostRead,
  useImageSavedDimensions,
  useMarkReadOnImageView,
  useSettingsStore,
} from '@src/state';
import { getImageRatio } from '@helpers/image';
import { Image, ImageLoadEventData } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { IDimensions } from '@src/types';
import { writeToLog } from '@src/helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const spinner = require('../../../../assets/spinner.svg');

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface IProps {
  source: string;
  blurRadius?: number;
  title?: string;
  height?: number;
  width?: number;
  overrideDimensions?: boolean;
  borderRadius?: number;
  postId?: number;
}

function ViewerImage({
  source,
  blurRadius,
  title,
  height = 300,
  width = 300,
  overrideDimensions = false,
  borderRadius = 0,
  postId,
}: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);
  const markReadOnImagePress = useMarkReadOnImageView();

  const loaded = useRef(false);
  const viewerRef = useRef<View>();

  const ignoreHeight = useSettingsStore(
    (state) => state.imagesIgnoreScreenHeight,
  );

  const opacity = useSharedValue(1);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (opacity.value === 0) {
      opacity.value = 1;
    }
  }, [imageViewer.visible]);

  const onImagePress = useCallback(async () => {
    // figure out if we want to do something
    if (
      !loaded.current ||
      imageViewer.setParams == null ||
      imageViewer.setVisible == null
    ) {
      return;
    }

    // Set the viewer ref
    imageViewer.setViewerRef?.(viewerRef);
    imageViewer.setParams?.({
      source,
      title,
    });
    // Display the viewer
    imageViewer.setVisible?.(true);
    // Set the viewer dimensions
    imageViewer.setDimensions?.(
      savedDimensions?.dimensions as unknown as IDimensions,
    );

    // Set the opacity of the image to zero. Use a slight timeout so that we don't get a flicker
    setTimeout(() => {
      opacity.value = 0;
    }, 100);

    // Now see if we want to mark the post as read
    if (postId != null && markReadOnImagePress) {
      setPostRead({
        postId,
      });
    }
  }, [source, savedDimensions, markReadOnImagePress]);

  const onLoad = useCallback(
    (e: ImageLoadEventData) => {
      try {
        const dimensions = {
          height: e.source.height,
          width: e.source.width,
        };

        const viewerDimensions = getImageRatio(
          dimensions.height,
          dimensions.width,
          ignoreHeight ? 0.9 : 0.6,
        );

        if (savedDimensions != null) return;

        saveImageDimensions(source, { dimensions, viewerDimensions });
      } catch (e: any) {
        writeToLog('Image issues!');
        writeToLog(e);
      }
    },
    [source],
  );

  const onLoadEnd = useCallback(() => {
    loaded.current = true;
  }, []);

  return (
    <Pressable
      onPress={onImagePress}
      style={{ alignItems: 'center' }}
      // @ts-expect-error valid
      ref={viewerRef}
    >
      <AnimatedImage
        source={source}
        style={[
          overrideDimensions || savedDimensions?.viewerDimensions == null
            ? { height, width }
            : savedDimensions?.viewerDimensions,
          { borderRadius },
          imageStyle,
        ]}
        onLoad={onLoad}
        onLoadEnd={onLoadEnd}
        blurRadius={blurRadius}
        placeholder={spinner}
        placeholderContentFit="scale-down"
        recyclingKey={source}
      />
    </Pressable>
  );
}

export default React.memo(ViewerImage);
