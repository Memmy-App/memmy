import { useState } from "react";
import { Dimensions as RNDimensions } from "react-native";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { Dimensions } from "./common";

interface UseMediaDimensions {
  dimensions: AllDimensions;
  update: (mediaDimensions: Dimensions) => void;
  updateWithThumbnail: (
    mediaDimensions: Dimensions,
    thumbnailDimensions: Dimensions
  ) => void;
  updateWithNoThumbnail: (mediaDimensions: Dimensions) => void;
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
    updateWithThumbnail(mediaDimensions, mediaDimensions);

  const updateWithThumbnail = (
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

  const updateWithNoThumbnail = (mediaDimensions: Dimensions) => {
    setDimensions({
      scaledDimensions: dimensions.scaledDimensions,
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
    updateWithThumbnail,
    updateWithNoThumbnail,
    dimensions,
  };
}

const getRatio = (
  realHeight: number,
  realWidth: number,
  modifier: number = 0.6
): Dimensions => {
  realHeight = realHeight || 0; // In case NaN (or falsey values) is passed. Having NaN here will cause the app to crash.
  realWidth = realWidth || 0;

  if (realHeight === 0 || realWidth === 0) {
    // Divinding by 0 will cause the app to crash because mediaHeight or mediaWidth will be null, casted to a number becoming NaN (somehow), causing rn bridge to crash.
    return {
      height: 0,
      width: 0,
    };
  }

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
