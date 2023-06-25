import React, { useMemo } from "react";
import { Share, useWindowDimensions } from "react-native";
import { Modal, useToast, View } from "native-base";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import ImageViewFooter from "./ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";

function ImageModal({
  source,
  isOpen,
  onRequestClose,
  width,
  height,
}: {
  source: string;
  width: number;
  height: number;
  isOpen: boolean;
  onRequestClose?: () => void;
}) {
  const toast = useToast();
  const onSave = () => {
    toast.show({
      title: "Image saved",
      duration: 3000,
    });

    downloadAndSaveImage(source);
  };
  const onShare = () => {
    Share.share({
      url: source,
    });
  };

  const dimensions = useWindowDimensions();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateY = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const translateX = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);

  const MAX_ZOOM_SCALE = 3;

  const { width: finalWidth, height: finalHeight } = useMemo(() => {
    function ruleOfThree(
      firstValue: number,
      firstResult: number,
      secondValue: number
    ) {
      const secondResult = (firstResult * secondValue) / firstValue;

      return secondResult;
    }

    const resizedBasedOnWidth = {
      width: dimensions.width,
      height: ruleOfThree(width, dimensions.width, height),
    };

    const resizedBasedOnHeight = {
      width: ruleOfThree(height, dimensions.height, width),
      height: dimensions.height,
    };

    if (width === height) {
      const smallestScreenDimension = Math.min(
        dimensions.width,
        dimensions.height
      );

      return {
        width: smallestScreenDimension,
        height: smallestScreenDimension,
      };
    }
    if (width > height) {
      return resizedBasedOnWidth;
    }
    if (resizedBasedOnHeight.width > dimensions.width) {
      return resizedBasedOnWidth;
    }

    return resizedBasedOnHeight;
  }, [width, height, dimensions.width, dimensions.height]);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scale.value < 1) {
        return;
      }

      const realImageWidth = finalWidth * scale.value;

      const maxTranslateX =
        realImageWidth <= dimensions.width
          ? 0
          : (realImageWidth - dimensions.width) / 2;
      const minTranslateX =
        realImageWidth <= dimensions.width
          ? 0
          : -(realImageWidth - dimensions.width) / 2;

      const possibleNewTranslateX = savedTranslateX.value + event.translationX;

      if (possibleNewTranslateX > maxTranslateX) {
        translateX.value = maxTranslateX;
      } else if (possibleNewTranslateX < minTranslateX) {
        translateX.value = minTranslateX;
      } else {
        translateX.value = possibleNewTranslateX;
      }

      if (scale.value > 1) {
        const realImageHeight = finalHeight * scale.value;

        const maxTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : (realImageHeight - dimensions.height) / 2;
        const minTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : -(realImageHeight - dimensions.height) / 2;

        const possibleNewTranslateY =
          savedTranslateY.value + event.translationY;

        if (possibleNewTranslateY > maxTranslateY) {
          translateY.value = maxTranslateY;
        } else if (possibleNewTranslateY < minTranslateY) {
          translateY.value = minTranslateY;
        } else {
          translateY.value = possibleNewTranslateY;
        }
      } else {
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd((event) => {
      if (scale.value === 1) {
        if (event.translationY < -50 || event.translationY > 50) {
          if (
            event.velocityY < -600 ||
            event.translationY < -200 ||
            event.velocityY > 600 ||
            event.translationY > 1300
          ) {
            runOnJS(onRequestClose)();

            scale.value = 1;
            savedScale.value = 1;

            translateY.value = 0;
            savedTranslateY.value = 0;

            translateX.value = 0;
            savedTranslateX.value = 0;

            return;
          }
        }

        translateY.value = withTiming(0);
        translateX.value = withTiming(0);
      } else if (scale.value < 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else if (scale.value > MAX_ZOOM_SCALE) {
        scale.value = withTiming(MAX_ZOOM_SCALE);
      } else {
        const realImageWidth = finalWidth * scale.value;

        const maxTranslateX =
          realImageWidth <= dimensions.width
            ? 0
            : (realImageWidth - dimensions.width) / 2;
        const minTranslateX =
          realImageWidth <= dimensions.width
            ? 0
            : -(realImageWidth - dimensions.width) / 2;

        translateX.value = withDecay({
          velocity: event.velocityX,
          clamp: [minTranslateX, maxTranslateX],
        });

        const realImageHeight = finalHeight * scale.value;

        const maxTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : (realImageHeight - dimensions.height) / 2;
        const minTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : -(realImageHeight - dimensions.height) / 2;

        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [minTranslateY, maxTranslateY],
        });
      }
    });

  // const singleTap = Gesture.Tap().onEnd(() => {
  //   onSingleTap && runOnJS(onSingleTap)();
  // });

  const doubleTap = Gesture.Tap()
    .onStart((event) => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(MAX_ZOOM_SCALE);

        const realImageWidth = finalWidth * MAX_ZOOM_SCALE;

        const maxTranslateX = (realImageWidth - dimensions.width) / 2;
        const minTranslateX = -(realImageWidth - dimensions.width) / 2;

        const possibleNewTranslateX =
          (finalWidth / 2 - event.x) * MAX_ZOOM_SCALE;

        let newTranslateX = 0;

        if (possibleNewTranslateX > maxTranslateX) {
          newTranslateX = maxTranslateX;
        } else if (possibleNewTranslateX < minTranslateX) {
          newTranslateX = minTranslateX;
        } else {
          newTranslateX = possibleNewTranslateX;
        }

        translateX.value = withTiming(newTranslateX);

        const realImageHeight = finalHeight * MAX_ZOOM_SCALE;

        const maxTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : (realImageHeight - dimensions.height) / 2;
        const minTranslateY =
          realImageHeight <= dimensions.height
            ? 0
            : -(realImageHeight - dimensions.height) / 2;

        const possibleNewTranslateY =
          (finalHeight / 2 - event.y) * MAX_ZOOM_SCALE;

        let newTranslateY = 0;

        if (possibleNewTranslateY > maxTranslateY) {
          newTranslateY = maxTranslateY;
        } else if (possibleNewTranslateY < minTranslateY) {
          newTranslateY = minTranslateY;
        } else {
          newTranslateY = possibleNewTranslateY;
        }

        translateY.value = withTiming(newTranslateY);
      }
    })
    .numberOfTaps(2);

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const imageAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: scale.value,
        },
      ],
    }),
    []
  );

  const composedGestures = Gesture.Simultaneous(pinchGesture, panGesture);
  const allGestures = Gesture.Exclusive(composedGestures, doubleTap);

  // @ts-ignore
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

  const image = (
    <GestureDetector gesture={allGestures}>
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <Animated.View style={imageContainerAnimatedStyle}>
          <AnimatedFastImage
            source={{ uri: source }}
            resizeMode="contain"
            style={[
              imageAnimatedStyle,
              {
                width: finalWidth,
                height: finalHeight,
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose}>
      {image}
      <View position="absolute" bottom={0} width="100%">
        <ImageViewFooter onSave={onSave} onShare={onShare} />
      </View>
    </Modal>
  );
}

export default ImageModal;
