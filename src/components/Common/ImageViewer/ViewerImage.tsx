import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';

import { useImageViewer } from './ImageViewerProvider';

interface IProps {
  source: string;
}

function ViewerImage({ source }: IProps): React.JSX.Element {
  const imageViewer = useImageViewer();

  const onImagePress = useCallback(() => {
    if (imageViewer.setSource == null || imageViewer.setVisible == null) return;

    imageViewer.setSource(source);
    imageViewer.setVisible(true);
  }, [source]);

  return (
    <Pressable onPress={onImagePress}>
      <Image source={{ uri: source }} style={{ height: 100 }} />
    </Pressable>
  );
}

export default React.memo(ViewerImage);
