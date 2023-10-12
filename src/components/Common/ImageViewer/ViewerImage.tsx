import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useImageViewer } from './ImageViewerProvider';
import {
  saveImageDimensions,
  useImageSavedDimensions,
} from '@src/state/image/imageStore';
import { getImageRatio } from '@helpers/image';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { Image, ImageLoadEventData } from 'expo-image';

interface IProps {
  source: string;
}

function ViewerImage({ source }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);

  const ignoreHeight = useSettingsStore(
    (state) => state.imagesIgnoreScreenHeight,
  );

  const dimensions = useMemo(() => {
    if (savedDimensions == null)
      return {
        height: 300,
      };

    return getImageRatio(
      savedDimensions.height,
      savedDimensions.width,
      ignoreHeight ? 0.9 : 0.6,
    );
  }, [savedDimensions]);

  const onImagePress = useCallback(() => {
    if (imageViewer.setSource == null || imageViewer.setVisible == null) return;

    imageViewer.setSource(source);
    imageViewer.setVisible(true);
  }, [source]);

  const onImageLoad = useCallback(
    (e: ImageLoadEventData) => {
      const dimensions = {
        height: e.source.height,
        width: e.source.width,
      };

      imageViewer.setDimensions!(dimensions);
      saveImageDimensions(source, dimensions);
      console.log(savedDimensions);
    },
    [imageViewer.setDimensions],
  );

  return (
    <Pressable onPress={onImagePress}>
      <Image
        source={{ uri: source }}
        style={dimensions}
        onLoad={onImageLoad}
        cachePolicy="disk"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ViewerImage);
