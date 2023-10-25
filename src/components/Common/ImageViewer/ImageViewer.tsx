import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions as RNDimensions, StyleSheet } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import { useImageViewer } from '@components/Common/ImageViewer/ImageViewerProvider';
import { getImageRatio } from '@helpers/image/getRatio';
import { View, YStack } from 'tamagui';
import { Image } from 'expo-image';
import ImageViewerHeader from '@components/Common/ImageViewer/ImageViewerHeader';
import ImageViewerFooter from '@components/Common/ImageViewer/ImageViewerFooter';
import AppToast from '@components/Common/Toast/AppToast';
import { playHaptic } from '@helpers/haptics';
import { ViewMeasurement } from '@src/types/ViewMeasurement';

const AnimatedImage = Animated.createAnimatedComponent(Image);

// interface MeasureResult {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   px: number;
//   py: number;
// }

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  RNDimensions.get('screen');

const MAX_SCALE = 3;

function ImageViewer(): React.JSX.Element {
  const imageViewer = useImageViewer();

  const [accessoriesVisible, setAccessoriesVisible] = useState(true);

  const viewerDims = useMemo(() => {
    return getImageRatio(
      imageViewer.dimensions.height,
      imageViewer.dimensions.width,
    );
  }, [imageViewer.dimensions]);

  const initialPosition = useRef<ViewMeasurement>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    height: 0,
    width: 0,
  });

  const zoomScale = useSharedValue(1);
  const lastScale = useSharedValue(1);

  const backgroundColor = useSharedValue('rgba(0,0,0,0)');

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const lastTap = useSharedValue(Date.now());

  const animatedImageRef = useAnimatedRef();

  useEffect(() => {
    if (imageViewer.visible) {
      // First we measure the image and store the values
      imageViewer.viewerRef?.current?.measure((x, y, w, h, px, py) => {
        // Store the initial position for later
        initialPosition.current = {
          x,
          y,
          width: w,
          height: h,
          px,
          py,
        };

        // FAde in the background
        backgroundColor.value = withTiming('rgba(0,0,0,1)', { duration: 200 });

        // Set the initial position
        positionX.value = px;
        positionY.value = py;

        // TODO Waiting on Expo patch for images
        // SEt the initial size
        // height.value = h;
        // width.value = w;

        // Center the image from the initial position and size the image up
        centerImage();

        // TODO Waiting on Expo patch for images
        // height.value = withTiming(viewerDims.height, { duration: 200 });
        // width.value = withTiming(viewerDims.width, { duration: 200 });
      });
    }
  }, [imageViewer.visible]);

  const onRequestClose = useCallback((): void => {
    if (imageViewer.visible) {
      setAccessoriesVisible(false);

      // Fade out the background
      backgroundColor.value = withTiming('rgba(0,0,0,0)', { duration: 200 });

      // Set the image back to the original position
      positionX.value = withTiming(initialPosition.current.px, {
        duration: 200,
      });
      positionY.value = withTiming(initialPosition.current.py, {
        duration: 200,
      });

      // Set the image back to the original dimensions
      height.value = withTiming(initialPosition.current.height, {
        duration: 200,
      });
      width.value = withTiming(initialPosition.current.width, {
        duration: 200,
      });

      // Dismiss the modal
      setTimeout(() => {
        imageViewer.setVisible?.(false);
      }, 200);
    }
  }, []);

  // This takes care of moving the image to the center whenever open the image
  // or whenever we want to reset the impage position
  const centerImage = useCallback((): void => {
    'worklet';

    positionX.value = withTiming(0, { duration: 200 });
    positionY.value = withTiming(0, { duration: 200 });
  }, []);

  // Animated position style
  const positionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoomScale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  // TODO Wait for expo fix
  // const dimensionsStyle = useAnimatedStyle(() => ({
  //   height: height.value,
  //   width: width.value,
  // }));

  const onSingleTap = useCallback(() => {
    cancelAnimation(positionX);
    cancelAnimation(positionY);

    if (zoomScale.value === 1 && lastTap.value + 200 < Date.now()) {
      setAccessoriesVisible((prev) => !prev);
    }

    lastTap.value = Date.now();
  }, []);

  const singleTapGesture = useMemo(
    () => Gesture.Tap().onStart(onSingleTap),
    [],
  );

  // <editor-fold desc="Double Tap Zomo">
  const onDoubleTap = useCallback((): void => {
    'worklet';

    runOnJS(setAccessoriesVisible)(false);

    // If the image is already zoomed, let's just reset it
    if (zoomScale.value !== 1) {
      centerImage();
      zoomScale.value = withTiming(1, { duration: 200 });
      lastScale.value = 1;
      return;
    }

    // Zoom to the max scale
    zoomScale.value = withTiming(1.75, { duration: 200 });
    lastScale.value = 1.75; // TODO set this back to 1.75
  }, []);

  // Create the double tap gesture
  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .maxDelay(200)
        .maxDuration(200)
        .onEnd(onDoubleTap),
    [],
  );

  // </editor-fold>

  // <editor-fold desc="Pan Gestures">

  const onPanBegin = useCallback((): void => {
    'worklet';

    // We need to reset everything first
    lastTranslateX.value = 0;
    lastTranslateY.value = 0;

    // Later we will hide whatever accessories we might be displaying
  }, []);

  const onPanUpdate = useCallback(
    (event: GestureUpdateEvent<PanGestureHandlerEventPayload>): void => {
      'worklet';

      // Move the image
      positionX.value += event.translationX - lastTranslateX.value;
      positionY.value += event.translationY - lastTranslateY.value;

      // Save the last translation
      lastTranslateX.value = event.translationX;
      lastTranslateY.value = event.translationY;
    },
    [],
  );

  const onPanEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>): void => {
      'worklet';

      // First let's see if we need to make any calculations. We will just be dismissing the image if the velocity of X
      // is too high, so 'ets check that first.

      // // First create an absolute value

      const velocity = Math.abs(event.velocityY);
      const translationX = Math.abs(event.translationX);

      if (velocity > 800 && zoomScale.value <= 1 && translationX < 75) {
        // Just dismiss and return
        runOnJS(onRequestClose)();
        return;
      }

      // We need to get a measurement so we know how large the image is.
      const width = viewerDims.width * zoomScale.value;
      const height = viewerDims.height * zoomScale.value;

      // Next we need to determine the furthest positionX can go. Let's calculate that
      const mostX = ((zoomScale.value - 1) * viewerDims.width) / 2;

      if (width < SCREEN_WIDTH) {
        // We always bring the image to zero if it is smaller than the viewport width
        positionX.value = withTiming(0, { duration: 200 });
      } else if (Math.abs(positionX.value) > mostX) {
        // If we've exceeded the limit, we want to bring the image back to center.
        positionX.value = withTiming(
          Math.sign(positionX.value) === 1 ? mostX : -mostX,
          { duration: 300 },
        );
        runOnJS(playHaptic)();
      } else {
        // Otherwise, we can continue. We need to set a clamp on this value so we don't go outside the boundaries.
        // We will also use a rubber band effect so that if we do go outside the clamp it isn't jarring
        positionX.value = withDecay({
          velocity: event.velocityX / 1.2,
          clamp: [-mostX, mostX],
          rubberBandEffect: true,
          velocityFactor: 0.5 * zoomScale.value,
          rubberBandFactor: 2,
        });
      }

      const mostY = ((zoomScale.value - 1) * viewerDims.height) / 2;

      if (height < SCREEN_HEIGHT) {
        positionY.value = withTiming(0, { duration: 200 });
      } else if (Math.abs(positionY.value) > mostY) {
        // If we've exceeded the limit, we want to bring the image back to center.
        positionY.value = withTiming(
          Math.sign(positionY.value) === 1 ? mostY : -mostY,
          { duration: 300 },
        );
        runOnJS(playHaptic)();
      } else {
        // Otherwise, we can continue. We need to set a clamp on this value so we don't go outside the boundaries.
        // We will also use a rubber band effect so that if we do go outside the clamp it isn't jarring
        positionY.value = withDecay({
          velocity: event.velocityY / 1.2,
          clamp: [-mostY, mostY],
          rubberBandEffect: true,
          velocityFactor: 0.5 * zoomScale.value,
          rubberBandFactor: 2,
        });
      }
    },
    [],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(2)
        .onBegin(onPanBegin)
        .onUpdate(onPanUpdate)
        .onEnd(onPanEnd),
    [],
  );

  // </editor-fold>

  // <editor-fold desc="Pinch Gestures">

  const onPinchStart = useCallback((): void => {
    'worklet';

    // We should just hide the accessories. Later
  }, []);

  const onPinchUpdate = useCallback(
    (event: GestureUpdateEvent<PinchGestureHandlerEventPayload>): void => {
      'worklet';

      // Simply increase the zoom scale
      zoomScale.value = lastScale.value * event.scale;
    },
    [],
  );

  const onPinchEnd = useCallback((): void => {
    'worklet';

    // If we have zoomed out past a scale of one, we should just reset the image
    if (zoomScale.value <= 1) {
      zoomScale.value = withTiming(1, { duration: 200 });
      centerImage();

      lastScale.value = 1;
      runOnJS(playHaptic)();

      return;
    }

    // Don't let the user zoom in too much
    if (zoomScale.value > MAX_SCALE) {
      zoomScale.value = withTiming(MAX_SCALE, { duration: 200 });

      lastScale.value = MAX_SCALE;
      runOnJS(playHaptic)();

      return;
    }

    // Save the last scale
    lastScale.value = zoomScale.value;
  }, []);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(onPinchStart)
        .onUpdate(onPinchUpdate)
        .onEnd(onPinchEnd),
    [],
  );

  // </editor-fold>

  // Create our joined gestures
  const panAndPinchGestures = Gesture.Simultaneous(panGesture, pinchGesture);
  const tapGestures = Gesture.Simultaneous(singleTapGesture, doubleTapGesture);
  const allGestures = Gesture.Exclusive(panAndPinchGestures, tapGestures);

  return (
    <View flex={1}>
      <AppToast />
      <ImageViewerHeader visible={accessoriesVisible} />
      <GestureDetector gesture={allGestures}>
        <YStack zIndex={-1} flex={1}>
          <Animated.View style={[styles.imageModal, backgroundStyle]}>
            <Animated.View style={[positionStyle, { alignItems: 'center' }]}>
              <AnimatedImage
                source={{ uri: imageViewer.params?.source }}
                style={[viewerDims, scaleStyle]}
                ref={animatedImageRef}
              />
            </Animated.View>
          </Animated.View>
        </YStack>
      </GestureDetector>

      <ImageViewerFooter visible={accessoriesVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageModal: {
    flex: 1,
    justifyContent: 'center',
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(ImageViewer);
