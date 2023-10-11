import { Dimensions as RNDimensions } from 'react-native';
import { Dimensions } from '@hooks/useImageDimensions';

export const getImageRatio = (
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
