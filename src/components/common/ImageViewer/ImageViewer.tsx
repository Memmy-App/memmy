// @ts-nocheck

import React, { useMemo, useRef, useState } from "react";
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
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { Icon, Text, useTheme, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useImageDimensions } from "./useImageDimensions";
import ExitButton from "./ImageExitButton";
import ImageViewFooter from "./ImageViewFooter";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ImageButton from "../Buttons/ImageButton";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";

interface IProps {
  source: { uri: string };
  postId?: number;
  heightOverride?: number;
  widthOverride?: number;
  style?: object;
  onPress?: () => unknown;
  recycled?: React.MutableRefObject<{}>;
  nsfw?: boolean;
  buttonMode?: boolean;
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

const clamp = (value, lowerBound, upperBound) => {
  "worklet";

  return Math.min(Math.max(value, lowerBound), upperBound);
};

function ImageViewer({
  source,
  postId,
  heightOverride,
  widthOverride,
  style = {
    /* What are you looking at?! */
  },
  onPress,
  recycled,
  nsfw,
  buttonMode = false,
}: IProps) {
  const theme = useTheme();

  const nonViewerRef = useRef<View>(null);

  const dimensions = useImageDimensions();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [accessoriesVisible, setAccessoriesVisible] = useState(false);

  // NSFW stuff, we need this hack for some reason
  const { blurNsfw } = useAppSelector(selectSettings);
  const [blurIntensity, setBlurIntensity] = useState(99);

  // Animation stuff

  const zoomScale = useSharedValue(1);

  const lastScale = useSharedValue(1);

  const backgroundColor = useSharedValue("rgba(0, 0, 0, 0)");
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const lastTransitionX = useSharedValue(0);
  const lastTransitionY = useSharedValue(0);

  const imageHeight = useSharedValue(0);
  const imageWidth = useSharedValue(0);

  const xOffset = useMemo(
    () => SCREEN_WIDTH / 2 - dimensions.dimensions.viewerDimensions.width / 2,
    [dimensions.dimensions.viewerDimensions]
  );

  const yOffset = useMemo(
    () => SCREEN_HEIGHT / 2 - dimensions.dimensions.viewerDimensions.height / 2,
    [dimensions.dimensions.viewerDimensions]
  );

  const initialPosition = useSharedValue<MeasureResult>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    py: 0,
    px: 0,
  });

  // Handle recycling

  // Store the last post id
  const lastPostId = useRef(postId);

  // Check if props have changed
  if (recycled && postId !== lastPostId.current) {
    // Save the dimensions for later
    recycled.current = {
      ...recycled.current,
      [lastPostId.current]: {
        height: dimensions.dimensions.actualDimensions.height,
        width: dimensions.dimensions.actualDimensions.width,
      },
    };

    // Check if we already have the new post's dimensions
    if (recycled.current[postId]) {
      // If we do let's go ahead and set them
      dimensions.update({
        height: recycled.current[postId].height,
        width: recycled.current[postId].width,
      });
    }

    // Store the new post ID
    lastPostId.current = postId;
  }

  // Whenever the image loads we want to set the dimensions
  const onLoad = (e: OnLoadEvent) => {
    dimensions.update({
      height: e.nativeEvent.height,
      width: e.nativeEvent.width,
    });

    if (nsfw && blurNsfw) {
      setBlurIntensity((prev) => (prev === 99 ? 100 : 99));
    }
  };

  // This opens or closes our modal
  const onRequestOpenOrClose = () => {
    if (!expanded) {
      if (onPress) onPress();

      // Make sure that the initial value for last zoom is reset
      lastScale.value = 1;
      zoomScale.value = 1;

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
        imageHeight.value = withTiming(
          dimensions.dimensions.viewerDimensions.height,
          {
            duration: 200,
          }
        );
        imageWidth.value = withTiming(
          dimensions.dimensions.viewerDimensions.width,
          {
            duration: 200,
          }
        );

        // Move image to the middle
        runOnUI(setToCenter)();
      });

      // Then we handle the fade
      backgroundColor.value = withTiming("rgba(0, 0, 0, 1)", { duration: 200 });

      setExpanded(true);

      // In 200ms we will be ready, so then we will display the accessories
      // Add 50ms to prevent visual bugs
      setTimeout(() => {
        setAccessoriesVisible(true);
      }, 250);
    } else {
      // Hide our accessories now
      setAccessoriesVisible(false);

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

    positionX.value = withTiming(xOffset, { duration: 200 });
    positionY.value = withTiming(yOffset, { duration: 200 });
    backgroundColor.value = withTiming("rgba(0, 0, 0, 1)", {
      duration: 300,
    });
  };

  const onPinchStart = () => {
    "worklet";

    if (accessoriesVisible) {
      runOnJS(setAccessoriesVisible)(false);
    }
  };

  const onPinchUpdate = (
    event: GestureUpdateEvent<PinchGestureHandlerEventPayload>
  ) => {
    "worklet";

    zoomScale.value = lastScale.value * event.scale;
  };

  const onPinchEnd = () => {
    "worklet";

    // If the user has zoomed out past the scale of one, we will reset the scale and display accessories. Play a haptic
    if (zoomScale.value <= 1) {
      zoomScale.value = withTiming(1, { duration: 300 });
      runOnJS(onGenericHapticFeedback)();
      runOnJS(setAccessoriesVisible)(true);
      setToCenter();
    }

    // We need this saved value for later
    lastScale.value = zoomScale.value >= 1 ? zoomScale.value : 1;
  };

  // Double tap result
  const onDoubleTap = (
    event: GestureUpdateEvent<TapGestureHandlerEventPayload>
  ) => {
    "worklet";

    // Move back to center and show accessories if we are returning to scale of one
    if (zoomScale.value !== 1) {
      setToCenter();

      runOnJS(setAccessoriesVisible)(true);
    } else {
      // Otherwise we should hide the accessories
      runOnJS(setAccessoriesVisible)(false);

      // Get the target
      const targetX = -(event.absoluteX - xOffset) + SCREEN_WIDTH / 2;
      const targetY = -(event.absoluteY - yOffset) + SCREEN_HEIGHT / 2;

      // Zoom to that target
      positionX.value = withTiming(targetX);
      positionY.value = withTiming(targetY);
    }

    // Update the scale based off of the current scale
    zoomScale.value = withTiming(zoomScale.value === 1 ? 2 : 1, {
      duration: 300,
    });

    // Reset the scale
    lastScale.value = 1;
  };

  const onPanBegin = () => {
    "worklet";

    // Reset
    lastTransitionX.value = 0;
    lastTransitionY.value = 0;

    // SEt the opacity to half
  };

  const onPanUpdate = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    if (
      backgroundColor.value === "rgba(0, 0, 0, 1)" &&
      (Math.abs(event.translationX) > 5 || Math.abs(event.translationY) > 5) &&
      zoomScale.value <= 1
    ) {
      backgroundColor.value = withTiming("rgba(0, 0, 0, 0.5)", {
        duration: 300,
      });
    }

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
    .onStart(onPinchStart)
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
      {buttonMode ? (
        <Pressable
          onPress={onRequestOpenOrClose}
          ref={nonViewerRef}
          style={{ opacity: expanded ? 0 : 1 }}
        >
          <ImageButton src={source.uri}>
            <FastImage
              style={{
                height: 50,
                width: 50,
              }}
              resizeMode="contain"
              source={source}
              onLoad={onLoad}
            />
          </ImageButton>
        </Pressable>
      ) : (
        <Pressable
          onPress={onRequestOpenOrClose}
          ref={nonViewerRef}
          style={{ opacity: expanded ? 0 : 1 }}
        >
          {(nsfw && blurNsfw && (
            <View style={styles.blurContainer}>
              <BlurView
                style={[
                  styles.blurView,
                  {
                    height: dimensions.dimensions.scaledDimensions.height,
                    width: dimensions.dimensions.scaledDimensions.width,
                  },
                ]}
                intensity={blurIntensity}
                tint={theme.config.initialColorMode}
              >
                <VStack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  space={2}
                >
                  <Icon
                    as={Ionicons}
                    name="alert-circle"
                    color={theme.colors.app.textSecondary}
                    size={16}
                  />
                  <Text fontSize="xl">NSFW</Text>
                  <Text>Sensitive content ahead</Text>
                </VStack>
              </BlurView>
              {!source.uri.includes(".gif") && (
                <FastImage
                  source={source}
                  style={[
                    heightOverride
                      ? { height: heightOverride, width: widthOverride }
                      : dimensions.dimensions.scaledDimensions,
                    style,
                  ]}
                  onLoad={onLoad}
                />
              )}
            </View>
          )) || (
            <FastImage
              source={source}
              style={[
                heightOverride
                  ? { height: heightOverride, width: widthOverride }
                  : dimensions.dimensions.scaledDimensions,
                style,
              ]}
              onLoad={onLoad}
            />
          )}
        </Pressable>
      )}
      <Modal visible={expanded} transparent>
        <ExitButton
          onPress={onRequestOpenOrClose}
          visible={accessoriesVisible}
        />
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
        <ImageViewFooter source={source.uri} visible={accessoriesVisible} />
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

  blurView: {
    position: "absolute",
    zIndex: 1,
  },

  blurContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(ImageViewer);
