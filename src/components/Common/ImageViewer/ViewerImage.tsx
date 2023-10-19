import React, { useCallback } from 'react';
import { Pressable } from 'react-native';

import { useImageViewer } from './ImageViewerProvider';
import {
  saveImageDimensions,
  useImageSavedDimensions,
  useSettingsStore,
} from '@src/state';
import { getImageRatio } from '@helpers/image';
import { Image, ImageLoadEventData } from 'expo-image';
import { IDimensions } from '@src/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const spinner = require('../../../../assets/spinner.svg');

interface IProps {
  source: string;
  blurRadius?: number;
  title?: string;
}

function ViewerImage({ source, blurRadius, title }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();
  const savedDimensions = useImageSavedDimensions(source);

  const ignoreHeight = useSettingsStore(
    (state) => state.imagesIgnoreScreenHeight,
  );

  const onImagePress = useCallback(() => {
    if (imageViewer.setParams == null || imageViewer.setVisible == null) return;

    imageViewer.setParams({
      source,
      title,
    });
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

      const viewerDimensions = getImageRatio(
        dimensions.height,
        dimensions.width,
        ignoreHeight ? 0.9 : 0.6,
      );

      if (savedDimensions != null) return;

      saveImageDimensions(source, { dimensions, viewerDimensions });
    },
    [source],
  );

  return (
    <Pressable onPress={onImagePress} style={{ alignItems: 'center' }}>
      <Image
        source={source}
        style={savedDimensions?.viewerDimensions ?? { height: 300, width: 300 }}
        onLoad={onImageLoad}
        blurRadius={blurRadius}
        placeholder={spinner}
        placeholderContentFit="scale-down"
        cachePolicy="disk"
        recyclingKey={source}
      />
    </Pressable>
  );
}

export default React.memo(ViewerImage);
