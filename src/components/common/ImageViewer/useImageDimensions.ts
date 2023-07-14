import { useState } from "react";
import { Dimensions as RNDimensions } from "react-native";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";

interface UseImageDimensions {
  dimensions: AllDimensions;
  update: (imageDimensions: Dimensions) => void;
}

interface AllDimensions {
  scaledDimensions: Dimensions;
  viewerDimensions: Dimensions;
  actualDimensions: Dimensions;
}

interface Dimensions {
  height: number;
  width: number;
}

const initialDimensions: Dimensions = {
  height: 0,
  width: 0,
};

export function useImageDimensions(): UseImageDimensions {
  const { ignoreScreenHeightInFeed } = useAppSelector(selectSettings);

  const [dimensions, setDimensions] = useState<AllDimensions>({
    scaledDimensions: initialDimensions,
    viewerDimensions: initialDimensions,
    actualDimensions: initialDimensions,
  });

  const update = (imageDimensions: Dimensions) => {
    setDimensions({
      scaledDimensions: getRatio(
        imageDimensions.height,
        imageDimensions.width,
        ignoreScreenHeightInFeed ? 0.9 : 0.6
      ),
      viewerDimensions: getRatio(
        imageDimensions.height,
        imageDimensions.width,
        0.9
      ),
      actualDimensions: imageDimensions,
    });
  };

  return {
    update,
    dimensions,
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
