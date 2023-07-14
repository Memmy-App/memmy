import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions as RNDimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import FastImage, { OnLoadEvent } from "react-native-fast-image";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useImageDimensions } from "./useImageDimensions";
import ExitButton from "./ImageExitButton";

interface IProps {
  source: { uri: string };
  heightOverride?: number;
  widthOverride?: number;
  style?: object;
  onPress?: () => unknown;
}

interface MeasureResult {
  x: number;
  y: number;
  width: number;
  height: number;
  px: number;
  py: number;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  RNDimensions.get("screen");

export default function ImageViewer({
  source,
  heightOverride,
  widthOverride,
  style = {},
  onPress,
}: IProps) {
  // We need to handle the possible FlashList re-uses, so we'll do that here

  useEffect(() => {
    console.log(`Render!${Date.now()}`);
  });

  const nonViewerRef = useRef<View>(null);

  const dimensions = useImageDimensions();

  const [expanded, setExpanded] = useState<boolean>(false);

  const zoomScale = useSharedValue(1);
  const backgroundColor = useSharedValue("rgba(0, 0, 0, 0)");
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const lastTransitionX = useSharedValue(0);
  const lastTransitionY = useSharedValue(0);

  const imageHeight = useSharedValue(0);
  const imageWidth = useSharedValue(0);

  const initialPosition = useSharedValue<MeasureResult>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    py: 0,
    px: 0,
  });

  // Whenever the image loads we want to set the dimensions
  const onLoad = (e: OnLoadEvent) => {
    dimensions.update({
      height: e.nativeEvent.height,
      width: e.nativeEvent.width,
    });
  };

  // This opens or closes our modal
  const onRequestOpenOrClose = () => {
    if (!expanded) {
      if (onPress) onPress();

      // If expanded is false, we are opening up. So we want to fade in the background color
      // First we set the position information
      nonViewerRef.current.measure((x, y, width, height, px, py) => {
        initialPosition.value = {
          x,
          y,
          width,
          height,
          px,
          py,
        };

        // Set the position to the initial
        positionX.value = px;
        positionY.value = py;

        // Set the size to the initial size
        imageHeight.value = height;
        imageWidth.value = width;

        // Size the image up
        imageHeight.value = withTiming(dimensions.dimensions.height, {
          duration: 200,
        });
        imageWidth.value = withTiming(dimensions.dimensions.width, {
          duration: 200,
        });

        // Move image to the middle
        runOnUI(setToCenter)();
      });

      // Then we handle the fade
      backgroundColor.value = withTiming("rgba(0, 0, 0, 1)", { duration: 200 });

      setExpanded(true);
    } else {
      // Here we need to not only change the background color, but we also don't want the modal to disappear
      // until AFTER the animation is complete
      // First we move the image back to its original position
      positionX.value = withTiming(initialPosition.value.px, { duration: 200 });
      positionY.value = withTiming(initialPosition.value.py, { duration: 200 });

      // While also changing the size back
      imageHeight.value = withTiming(initialPosition.value.height, {
        duration: 200,
      });
      imageWidth.value = withTiming(initialPosition.value.width, {
        duration: 200,
      });

      backgroundColor.value = withTiming("rgba(0, 0, 0, 0)", { duration: 200 });

      // Animation is finished after 200 ms, so we will set to hidden after that.
      setTimeout(() => {
        setExpanded(false);
      }, 200);
    }
  };

  const setToCenter = () => {
    "worklet";

    positionX.value = withTiming(
      SCREEN_WIDTH / 2 - dimensions.dimensions.width / 2,
      { duration: 200 }
    );
    positionY.value = withTiming(
      SCREEN_HEIGHT / 2 - dimensions.dimensions.height / 2,
      { duration: 200 }
    );
    backgroundColor.value = withTiming("rgba(0, 0, 0, 1)", {
      duration: 300,
    });
  };

  const onPinchUpdate = (
    event: GestureUpdateEvent<PinchGestureHandlerEventPayload>
  ) => {
    "worklet";

    // We will update the current scale based on whatever the additional scale from the new pinch event is
    zoomScale.value = event?.scale;
  };

  const onPinchEnd = () => {
    "worklet";

    // If the user has zoomed out past the scale of one, we will reset the scale
    if (zoomScale.value < 1) {
      zoomScale.value = withTiming(1, { duration: 300 });
    }
  };

  // Double tap result
  const onDoubleTap = () => {
    "worklet";

    // Move back to center if we are returning to scale of one
    if (zoomScale.value !== 1) {
      setToCenter();
    }

    // Update the scale based off of the current scale
    zoomScale.value = withTiming(zoomScale.value === 1 ? 2 : 1, {
      duration: 300,
    });
  };

  const onPanBegin = () => {
    "worklet";

    // Reset
    lastTransitionX.value = 0;
    lastTransitionY.value = 0;

    // SEt the opacity to half
    if (zoomScale.value <= 1) {
      backgroundColor.value = withTiming("rgba(0, 0, 0, 0.5)", {
        duration: 300,
      });
    }
  };

  const onPanUpdate = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    // We move the position based on the pan. We also have to divide this by the zoom scale.
    positionX.value +=
      (event.translationX - lastTransitionX.value) / zoomScale.value;
    positionY.value +=
      (event.translationY - lastTransitionY.value) / zoomScale.value;

    // Save the last translation for use later
    lastTransitionX.value = event.translationX;
    lastTransitionY.value = event.translationY;
  };

  const onPanEnd = (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    // Get the velocity of the Y axis. Convert it to a postiive number if it is negative.
    const velocity = event.velocityY < 0 ? -event.velocityY : event.velocityY;

    // If the velocity is greater than 800 and the current zoom scale is equal to one, we should request close
    if (velocity > 800 && zoomScale.value <= 1) {
      runOnJS(onRequestOpenOrClose)();
      return;
    }

    // We should reset to center afterward if the scale is less than one
    if (zoomScale.value <= 1) {
      setToCenter();
    }
  };

  // This handles all of our pan gestures
  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .onBegin(onPanBegin)
    .onUpdate(onPanUpdate)
    .onEnd(onPanEnd);

  // This handles all of our pinch gestures
  const pinchGesture = Gesture.Pinch()
    .onUpdate(onPinchUpdate)
    .onEnd(onPinchEnd);

  // This handles our double tap
  // TODO Add a single tap for closing
  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(100)
    .onEnd(onDoubleTap);

  // This handles our background color styles
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  // This handles our pinch to zoom styles
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoomScale.value }],
  }));

  // This handles the position of the image inside the view
  const positionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  const dimensionsStyle = useAnimatedStyle(() => ({
    height: imageHeight.value,
    width: imageWidth.value,
  }));

  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage as any);

  return (
    <View style={styles.imageContainer}>
      <Pressable
        onPress={onRequestOpenOrClose}
        ref={nonViewerRef}
        style={{ opacity: expanded ? 0 : 1 }}
      >
        <FastImage
          source={source}
          style={[
            heightOverride
              ? { height: heightOverride, width: widthOverride }
              : dimensions.dimensions,
            style,
          ]}
          onLoad={onLoad}
        />
      </Pressable>
      <Modal visible={expanded} transparent>
        <ExitButton onPress={onRequestOpenOrClose} />
        <View style={{ flex: 1, zIndex: -1 }}>
          <GestureDetector gesture={tapGesture}>
            <GestureDetector gesture={panGesture}>
              <GestureDetector gesture={pinchGesture}>
                <Animated.View style={[styles.imageModal, backgroundStyle]}>
                  <Animated.View style={[scaleStyle]}>
                    <Animated.View style={[positionStyle]}>
                      <AnimatedFastImage
                        source={source}
                        style={[dimensionsStyle]}
                      />
                    </Animated.View>
                  </Animated.View>
                </Animated.View>
              </GestureDetector>
            </GestureDetector>
          </GestureDetector>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageModal: {
    flex: 1,
    backgroundColor: "transparent",
  },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
