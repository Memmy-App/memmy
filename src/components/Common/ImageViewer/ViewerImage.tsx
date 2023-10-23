import React, { useCallback, useRef } from 'react';
import { Pressable } from 'react-native';

import { useImageViewer } from './ImageViewerProvider';
import {
  markPostRead,
  saveImageDimensions,
  useImageSavedDimensions,
  useMarkReadOnImageView,
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

  const ignoreHeight = useSettingsStore(
    (state) => state.imagesIgnoreScreenHeight,
  );

  const onImagePress = useCallback(() => {
    // figure out if we want to do something
    if (
      !loaded.current ||
      imageViewer.setParams == null ||
      imageViewer.setVisible == null
    )
      return;

    // Set the params
    imageViewer.setParams({
      source,
      title,
    });
    // Display the viewer
    imageViewer.setVisible(true);
    // Set the viewer dimensions
    imageViewer.setDimensions!(
      savedDimensions?.dimensions as unknown as IDimensions,
    );

    // Now see if we want to mark the post as read
    if (postId != null && markReadOnImagePress) {
      markPostRead(postId);
    }
  }, [source, savedDimensions, markReadOnImagePress]);

  const onLoad = useCallback(
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

  const onLoadEnd = useCallback(() => {
    loaded.current = true;
  }, []);

  return (
    <Pressable onPress={onImagePress} style={{ alignItems: 'center' }}>
      <Image
        source={source}
        style={[
          overrideDimensions || savedDimensions?.viewerDimensions == null
            ? { height, width }
            : savedDimensions?.viewerDimensions,
          { borderRadius },
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
