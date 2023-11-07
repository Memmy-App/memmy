import React, { useCallback, useState } from 'react';
import { IGiphySearchResult } from '@src/hooks';
import { YStack } from 'tamagui';
import { Image, ImageLoadEventData } from 'expo-image';
import { Dimensions, StyleSheet } from 'react-native';
import { IDimensions } from 'expo-image-viewer/src/types';

interface IProps {
  result: IGiphySearchResult;
}

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

const resizeImage = (dimensions: IDimensions): IDimensions => {
  const widthRatio = (WINDOW_WIDTH * 0.5) / dimensions.width;
  const heightRatio = WINDOW_HEIGHT / dimensions.height;

  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: dimensions.width * ratio - 12,
    height: dimensions.height * ratio,
  };
};

export default function GiphyImageButton({
  result,
}: IProps): React.JSX.Element {
  const [dimensions, setDimensions] = useState({
    width: WINDOW_WIDTH / 2,
    height: 200,
  });

  const onImageLoad = useCallback((e: ImageLoadEventData) => {
    setDimensions(
      resizeImage({
        width: e.source.width,
        height: e.source.height,
      }),
    );
  }, []);

  return (
    <YStack
      borderRadius={10}
      alignItems="center"
      justifyContent="center"
      margin={3}
    >
      <Image
        source={result.proxyUrl}
        style={[styles.image, dimensions]}
        cachePolicy="none"
        onLoad={onImageLoad}
        contentFit="cover"
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
  },
});
