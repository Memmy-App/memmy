import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions as RNDimensions,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import FastImage from "@gkasdorf/react-native-fast-image";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { Text, useTheme, View, VStack } from "native-base";
import { StatusBar } from "expo-status-bar";
import { IconAlertTriangle } from "tabler-icons-react-native";
import { Video, ResizeMode } from "expo-av";
import { useMediaDimensions } from "../useMediaDimensions";
import ExitButton from "../MediaExitButton";
import VideoViewFooter from "./VideoViewFooter";
import { useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import ImageButton from "../../Buttons/ImageButton";
// import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import Toast from "../../Toast";
import { MediaProps } from "../common";
import useThumbnail, {
  UseThumbnail,
} from "../../../../hooks/media/useThumbnail";

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

function VideoViewer({
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
}: MediaProps) {
  const theme = useTheme();

  // @ts-ignore
  const nonViewerRef = useRef<View>(null);

  const dimensions = useMediaDimensions();

  const [expanded, setExpanded] = useState<boolean>(false);

  // NSFW stuff, we need this hack for some reason
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);
  const [blurIntensity, setBlurIntensity] = useState(99);

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  // Animation stuff

  // Bool for showing or hiding the accessories
  const accessoriesOpacity = useSharedValue(0);

  // Zoom scale for the viewer
  const zoomScale = useSharedValue(1);

  // Background color for the viewer. Start at 0 opacity and transition to one
  const backgroundColor = useSharedValue("rgba(0, 0, 0, 0)");

  // Position of the image inside the viewer
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  // Stored heights
  const videoHeight = useSharedValue(0);
  const videoWidth = useSharedValue(0);

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
        videoHeight.value = height;
        videoWidth.value = width;

        // Size the image up
        videoHeight.value = withTiming(
          dimensions.dimensions.viewerDimensions.height,
          {
            duration: 200,
          }
        );
        videoWidth.value = withTiming(
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
      videoHeight.value = withTiming(initialPosition.value.height, {
        duration: 200,
      });
      videoWidth.value = withTiming(initialPosition.value.width, {
        duration: 200,
      });

      backgroundColor.value = withTiming("rgba(0, 0, 0, 0)", { duration: 200 });

      // Animation is finished after 200 ms, so we will set to hidden after that.
      setTimeout(() => {
        // Reset all the values
        positionX.value = 0;
        positionY.value = 0;
        zoomScale.value = 1;
        videoHeight.value = 0;
        videoWidth.value = 0;

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

  const onTap = () => {
    "worklet";

    if (accessoriesOpacity.value !== 1) {
      // Show accessories if they are hidden
      toggleAccessories(true);
    } else {
      // Otherwise we should hide the accessories
      toggleAccessories(false);
    }
  };

  const tapGesture = Gesture.Tap().numberOfTaps(1).maxDelay(100).onEnd(onTap);

  const [thumbnail, setThumbnail] = useState<UseThumbnail>(null);

  useEffect(() => {
    useThumbnail(source).then((payload) => {
      setThumbnail(payload);

      dimensions.updateWiththumbnail(
        dimensions.dimensions.actualDimensions,
        payload.dimensions
      );

      if (nsfw && blurNsfw) {
        setBlurIntensity((prev) => (prev === 99 ? 100 : 99));
      }
    });
  }, [source]);

  // This handles our background color styles
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  // // This handles our pinch to zoom styles
  // const scaleStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: zoomScale.value }],
  // }));

  // This handles the position of the image inside the view
  const positionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  const dimensionsStyle = useAnimatedStyle(() => ({
    height: videoHeight.value,
    width: videoWidth.value,
  }));

  const accessoriesStyle = useAnimatedStyle(() => ({
    opacity: accessoriesOpacity.value,
  }));

  const AnimatedVideo = Animated.createAnimatedComponent(Video);

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
              source={{ uri: thumbnail?.uri ?? "" }}
              // onLoad={onLoad}
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
                    dimensions.dimensions.scaledDimensions,
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
                    source={{ uri: thumbnail?.uri ?? "" }}
                    style={[
                      heightOverride
                        ? { height: heightOverride, width: widthOverride }
                        : dimensions.dimensions.scaledDimensions,
                      style,
                    ]}
                    // onLoad={onLoad}
                  />
                )}
              </View>
            )) || (
              <FastImage
                source={{ uri: thumbnail?.uri ?? "" }}
                style={[
                  heightOverride
                    ? { height: heightOverride, width: widthOverride }
                    : dimensions.dimensions.scaledDimensions,
                  style,
                ]}
                // onLoad={onLoad}
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
          <GestureDetector gesture={tapGesture}>
            <Animated.View style={[styles.imageModal, backgroundStyle]}>
              <Animated.View style={[positionStyle]}>
                <AnimatedVideo
                  source={{ uri: source }}
                  style={[dimensionsStyle]}
                  ref={video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  onPlaybackStatusUpdate={(status) => {
                    setStatus(status);
                  }}
                />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
        <Animated.View style={[accessoriesStyle]}>
          <VideoViewFooter source={source} />
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

export default React.memo(VideoViewer);
