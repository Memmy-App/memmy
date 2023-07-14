import { useState } from "react";
import { Dimensions as RNDimensions } from "react-native";

interface UseImageDimensions {
  dimensions: Dimensions;
  update: (imageDimensions: Dimensions) => void;
}

interface Dimensions {
  height: number;
  width: number;
}

export function useImageDimensions(): UseImageDimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const update = (imageDimensions: Dimensions) => {
    setDimensions(getRatio(imageDimensions.height, imageDimensions.width));
  };

  return {
    dimensions,
    update,
  };
}

const getRatio = (
  realHeight: number,
  realWidth: number,
  modifier: number = 0.6
): Dimensions => {
  const screenHeight = RNDimensions.get("screen").height * modifier;
  const screenWidth = RNDimensions.get("screen").width;

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
