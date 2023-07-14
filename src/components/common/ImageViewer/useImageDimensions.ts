import { useState } from "react";
import { Dimensions as RNDimensions } from "react-native";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";

interface UseImageDimensions {
  scaledDimensions: Dimensions;
  realDimensions: Dimensions;
  update: (imageDimensions: Dimensions) => void;
}

interface Dimensions {
  height: number;
  width: number;
}

export function useImageDimensions(): UseImageDimensions {
  const { ignoreScreenHeightInFeed } = useAppSelector(selectSettings);

  const [realDimensions, setRealDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const [scaledDimensions, setScaledDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const update = (imageDimensions: Dimensions) => {
    setScaledDimensions(
      getRatio(
        imageDimensions.height,
        imageDimensions.width,
        ignoreScreenHeightInFeed ? 0.9 : 0.6
      )
    );
    setRealDimensions(
      getRatio(imageDimensions.height, imageDimensions.width, 0.9)
    );
  };

  return {
    realDimensions,
    scaledDimensions,
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
