import { useState } from "react";
import { Dimensions as RNDimensions } from "react-native";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { Dimensions } from "./common";

interface UseMediaDimensions {
  dimensions: AllDimensions;
  update: (mediaDimensions: Dimensions) => void;
  updateWiththumbnail: (
    mediaDimensions: Dimensions,
    thumbnailDimensions: Dimensions
  ) => void;
}

interface AllDimensions {
  scaledDimensions: Dimensions;
  viewerDimensions: Dimensions;
  actualDimensions: Dimensions;
}

const initialDimensions: Dimensions = {
  height: 0,
  width: 0,
};

export function useMediaDimensions(): UseMediaDimensions {
  const { ignoreScreenHeightInFeed } = useAppSelector(selectSettings);

  const [dimensions, setDimensions] = useState<AllDimensions>({
    scaledDimensions: initialDimensions,
    viewerDimensions: initialDimensions,
    actualDimensions: initialDimensions,
  });

  const update = (mediaDimensions: Dimensions) =>
    updateWiththumbnail(mediaDimensions, mediaDimensions);

  const updateWiththumbnail = (
    mediaDimensions: Dimensions,
    thumbnailDimensions: Dimensions
  ) => {
    setDimensions({
      scaledDimensions: getRatio(
        thumbnailDimensions.height,
        thumbnailDimensions.width,
        ignoreScreenHeightInFeed ? 0.9 : 0.6
      ),
      viewerDimensions: getRatio(
        mediaDimensions.height,
        mediaDimensions.width,
        0.9
      ),
      actualDimensions: mediaDimensions,
    });
  };

  return {
    update,
    updateWiththumbnail,
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

  const mediaHeight = realHeight * ratio;
  const mediaWidth = realWidth * ratio;

  return {
    height: mediaHeight,
    width: mediaWidth,
  };
};
