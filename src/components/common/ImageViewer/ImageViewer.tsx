import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions as RNDimensions,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import FastImage, { OnLoadEvent } from "@gkasdorf/react-native-fast-image";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
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
import { Text, useTheme, View, VStack } from "native-base";
import { StatusBar } from "expo-status-bar";
import { IconAlertTriangle } from "tabler-icons-react-native";
import { useImageDimensions } from "./useImageDimensions";
import ExitButton from "./ImageExitButton";
import ImageViewFooter from "./ImageViewFooter";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import ImageButton from "../Buttons/ImageButton";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import Toast from "../Toast";

interface IProps {
  source: string;
  postId?: number;
  heightOverride?: number;
  widthOverride?: number;
  style?: object;
  onPress?: () => unknown;
  recycled?: React.MutableRefObject<{}>;
  nsfw?: boolean;
  buttonMode?: boolean;
  setPostRead?: () => void;
  compactMode?: boolean;
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

const MAX_SCALE = 3;

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
  setPostRead,
  compactMode,
}: IProps) {
  const theme = useTheme();

  // @ts-ignore
  const nonViewerRef = useRef<View>(null);

  const dimensions = useImageDimensions();

  const [expanded, setExpanded] = useState<boolean>(false);

  // NSFW stuff, we need this hack for some reason
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);
  const [blurIntensity, setBlurIntensity] = useState(99);

  // Animation stuff

  // Bool for showing or hiding the accessories
  const accessoriesOpacity = useSharedValue(0);

  // Zoom scale for the viewer
  const zoomScale = useSharedValue(1);

  // The last scale of the image when zooming. We use this to apply to the new value
  const lastScale = useSharedValue(1);

  // Background color for the viewer. Start at 0 opacity and transition to one
  const backgroundColor = useSharedValue("rgba(0, 0, 0, 0)");

  // Position of the image inside the viewer
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const lastTransitionX = useSharedValue(0);
  const lastTransitionY = useSharedValue(0);

  // Stored heights
  const imageHeight = useSharedValue(0);
  const imageWidth = useSharedValue(0);

  const lastTap = useSharedValue(0);

  const xCenter = useMemo(
    () => SCREEN_WIDTH / 2 - dimensions.dimensions.viewerDimensions.width / 2,
    [dimensions.dimensions.viewerDimensions]
  );

  const yCenter = useMemo(
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

      if (setPostRead && markReadOnPostImageView) {
        setPostRead();
      }

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
        runOnUI(toggleAccessories)(true);
      }, 250);
    } else {
      // Hide our accessories now
      runOnUI(toggleAccessories)(false);

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
        // Reset all the values
        positionX.value = 0;
        positionY.value = 0;
        zoomScale.value = 1;
        imageHeight.value = 0;
        imageWidth.value = 0;

        // Close the modal
        setExpanded(false);
      }, 200);
    }
  };

  const setToCenter = () => {
    "worklet";

    positionX.value = withTiming(xCenter, { duration: 200 });
    positionY.value = withTiming(yCenter, { duration: 200 });
    backgroundColor.value = withTiming("rgba(0, 0, 0, 1)", {
      duration: 300,
    });
  };

  const toggleAccessories = (show: boolean) => {
    "worklet";

    accessoriesOpacity.value = withTiming(show ? 1 : 0, { duration: 200 });
  };

  const onPinchStart = () => {
    "worklet";

    if (accessoriesOpacity.value === 1) {
      toggleAccessories(false);
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
      toggleAccessories(true);
      setToCenter();
    } else if (zoomScale.value > MAX_SCALE) {
      // We shouldn't allow zooming past the max scale
      zoomScale.value = withTiming(MAX_SCALE, { duration: 300 });
      runOnJS(onGenericHapticFeedback)();
    }

    // We need this saved value for later
    lastScale.value =
      zoomScale.value >= 1
        ? zoomScale.value > MAX_SCALE
          ? MAX_SCALE
          : zoomScale.value
        : 1;
  };

  // Double tap result
  const onDoubleTap = (
    event: GestureUpdateEvent<TapGestureHandlerEventPayload>
  ) => {
    "worklet";

    // Move back to center and show accessories if we are returning to scale of one
    if (zoomScale.value !== 1) {
      setToCenter();

      toggleAccessories(true);
    } else {
      // Otherwise we should hide the accessories
      toggleAccessories(false);

      const realHeight = dimensions.dimensions.viewerDimensions.height;
      const realWidth = dimensions.dimensions.viewerDimensions.width;

      const newHeight = realHeight * 2;
      const newWidth = realWidth * 2;

      const maxTranslateX = (newWidth - SCREEN_WIDTH) / 2;
      const minTranslateX = -(newWidth - SCREEN_WIDTH) / 2;

      const currentTransX = (realWidth / 2 - event.x) * 2;

      let transX;

      if (currentTransX > maxTranslateX) transX = maxTranslateX;
      else if (currentTransX < minTranslateX) transX = minTranslateX;
      else transX = currentTransX;

      const maxTranslateY =
        newHeight <= SCREEN_HEIGHT ? 0 : newHeight - SCREEN_HEIGHT;
      const minTranslateY =
        newHeight <= SCREEN_HEIGHT ? 0 : -(newHeight - SCREEN_HEIGHT);

      const currentTransY = (realHeight / 2 - event.y) * 2;

      let transY;

      if (currentTransY > maxTranslateY) transY = maxTranslateY;
      else if (currentTransY < minTranslateY) transY = minTranslateY;
      else transY = currentTransY;

      positionX.value = withTiming(transX);
      positionY.value = withTiming(transY);
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

    // Hide accessories
    if (zoomScale.value === 1) {
      if (lastTap.value + 200 < Date.now()) {
        toggleAccessories(!(accessoriesOpacity.value === 1));
      }
    } else {
      toggleAccessories(false);
    }

    lastTap.value = Date.now();
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

    // We move the position based on the pan
    positionX.value += event.translationX - lastTransitionX.value;
    positionY.value += event.translationY - lastTransitionY.value;

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
      toggleAccessories(false);
    } else {
      // Now we want to add some momentum to the end of the swipe
      // Take the velocity of the swipe and divide that by 1.5. Then, we normalize based off of the zoom scale by
      // dividing by whatever that number is

      positionX.value = withDecay({
        velocity: event.velocityX / 1.2,
      });
      positionY.value = withDecay({
        velocity: event.velocityY / 1.2,
      });
    }
  };

  // This handles all of our pan gestures
  const panGesture = Gesture.Pan()
    .maxPointers(2)
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

  const pinchAndPanGestures = Gesture.Simultaneous(panGesture, pinchGesture);
  const allGestures = Gesture.Exclusive(pinchAndPanGestures, tapGesture);

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

  const accessoriesStyle = useAnimatedStyle(() => ({
    opacity: accessoriesOpacity.value,
  }));

  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage as any);

  return (
    <View
      style={[
        styles.imageContainer,
        {
          borderRadius: compactMode ? 10 : 0,
        },
      ]}
      backgroundColor={theme.colors.app.bg}
    >
      {buttonMode ? (
        <Pressable
          onPress={onRequestOpenOrClose}
          ref={nonViewerRef}
          style={{ opacity: expanded ? 0 : 1 }}
        >
          <ImageButton src={source}>
            <FastImage
              style={[
                {
                  height: 50,
                  width: 50,
                },
              ]}
              resizeMode="contain"
              source={{ uri: source }}
              onLoad={onLoad}
            />
          </ImageButton>
        </Pressable>
      ) : (
        <Pressable
          onPress={onRequestOpenOrClose}
          ref={nonViewerRef}
          style={{
            opacity: expanded ? 0 : 1,
            borderRadius: compactMode ? 10 : 0,
          }}
        >
          <View>
            {(nsfw && blurNsfw && (
              <View
                style={[
                  styles.blurContainer,
                  {
                    borderRadius: compactMode ? 10 : 0,
                  },
                ]}
              >
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
                    <IconAlertTriangle
                      color={theme.colors.app.textSecondary}
                      size={36}
                    />
                    {!compactMode && (
                      <>
                        <Text fontSize="xl">NSFW</Text>
                        <Text>Sensitive content ahead</Text>
                      </>
                    )}
                  </VStack>
                </BlurView>
                {!source.includes(".gif") && (
                  <FastImage
                    source={{ uri: source }}
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
                source={{ uri: source }}
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
        </Pressable>
      )}
      <Modal visible={expanded} transparent>
        <Toast />
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="dark" />
        <Animated.View style={[accessoriesStyle]}>
          <ExitButton onPress={onRequestOpenOrClose} />
        </Animated.View>
        <View style={{ flex: 1, zIndex: -1 }}>
          <GestureDetector gesture={allGestures}>
            <Animated.View style={[styles.imageModal, backgroundStyle]}>
              <Animated.View style={[positionStyle]}>
                <AnimatedFastImage
                  source={{ uri: source }}
                  style={[scaleStyle, dimensionsStyle]}
                />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
        <Animated.View style={[accessoriesStyle]}>
          <ImageViewFooter source={source} />
        </Animated.View>
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
