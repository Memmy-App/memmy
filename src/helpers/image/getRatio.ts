import { Dimensions } from "react-native";

export const getRatio = (
  realHeight: number,
  realWidth: number,
  modifier: number = 0.6
): { imageHeight: number; imageWidth: number } => {
  const screenHeight = Dimensions.get("screen").height * modifier;
  const screenWidth = Dimensions.get("screen").width;

  const heightRatio = screenHeight / realHeight;
  const widthRatio = screenWidth / realWidth;

  const ratio = Math.min(widthRatio, heightRatio);

  const imageHeight = realHeight * ratio;
  const imageWidth = realWidth * ratio;

  return {
    imageHeight,
    imageWidth,
  };
};
