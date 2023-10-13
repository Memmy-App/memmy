import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';

import { useImageViewer } from './ImageViewerProvider';
import {
  saveImageDimensions,
  useImageSavedDimensions,
} from '@src/state/image/imageStore';
import { getImageRatio } from '@helpers/image';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { Image, ImageLoadEventData } from 'expo-image';
import { IDimensions } from '@src/types';
import HStack from '@components/Common/Stack/HStack';

interface IProps {
  source: string;
  blurRadius?: number;
}

function ViewerImage({ source, blurRadius }: IProps): React.JSX.Element {
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
    imageViewer.setDimensions!(savedDimensions as unknown as IDimensions);
  }, [source, savedDimensions]);

  const onImageLoad = useCallback((e: ImageLoadEventData) => {
    const dimensions = {
      height: e.source.height,
      width: e.source.width,
    };

    if (savedDimensions != null) return;

    saveImageDimensions(source, dimensions);
  }, []);

  return (
    <HStack>
      <Pressable
        onPress={onImagePress}
        style={{
          width: '100%',
        }}
      >
        <Image
          source={{ uri: source }}
          style={dimensions}
          onLoad={onImageLoad}
          blurRadius={blurRadius}
          cachePolicy="disk"
        />
      </Pressable>
    </HStack>
  );
}

export default React.memo(ViewerImage);
