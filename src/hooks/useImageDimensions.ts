import { useEffect, useState } from 'react';
import { Dimensions as RNDimensions } from 'react-native';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';

interface UseImageDimensions {
  dimensions: AllDimensions;
  update: (imageDimensions: Dimensions) => void;
}

interface AllDimensions {
  scaled: Dimensions;
  viewer: Dimensions;
  actual: Dimensions;
}

export interface Dimensions {
  height: number;
  width: number;
}

const initialDimensions: Dimensions = {
  height: 0,
  width: 0,
};

export const useImageDimensions = (): UseImageDimensions => {
  const ignoreScreenHeight = false;

  const imageViewer = useImageViewer();

  const [dimensions, setDimensions] = useState<AllDimensions>({
    scaled: initialDimensions,
    viewer: initialDimensions,
    actual: initialDimensions,
  });

  useEffect(() => {
    update();
  }, [imageViewer.dimensions]);

  const update = (): void => {
    console.log(
      getRatio(
        imageViewer.dimensions.height,
        imageViewer.dimensions.width,
        0.9,
      ),
    );

    setDimensions({
      scaled: getRatio(
        imageViewer.dimensions.height,
        imageViewer.dimensions.width,
        ignoreScreenHeight ? 0.9 : 0.6,
      ),
      viewer: getRatio(
        imageViewer.dimensions.height,
        imageViewer.dimensions.width,
        0.9,
      ),
      actual: imageViewer.dimensions,
    });
  };

  return {
    update,
    dimensions,
  };
};

const getRatio = (
  realHeight: number,
  realWidth: number,
  modifier = 0.6,
): Dimensions => {
  const screenHeight = RNDimensions.get('screen').height;
  const screenWidth = RNDimensions.get('screen').width;

  const heightRatio = screenHeight / realHeight;
  const widthRatio = screenWidth / realWidth;

  const ratio = Math.min(widthRatio, heightRatio);

  const imageHeight = realHeight * ratio;
  const imageWidth = realWidth * ratio;

  return {
    height: imageHeight,
    width: imageWidth,
  };
};
