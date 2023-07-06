import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { Handlers, SwipeableRowGestureContext } from "./types";
import { SwipeableRowProvider } from "./SwipeableRowProvider";

interface Props {
  /**
   * The left option to display when swiping left to right
   */
  leftOption?: JSX.Element;

  /**
   * The right option to display when swiping right to left
   */
  rightOption?: JSX.Element;

  /**
   * The shared value to use for the translateX value.
   * This value will be updated while the user swipes
   * as well as lets go.
   */
  translateX?: SharedValue<number>;

  /**
   * The component which will pan right and left as the user drags
   */
  children: React.ReactNode;
}

export const SwipeableRow = ({ leftOption, rightOption, children }: Props) => {
  const [subscribers, setSubscribers] = useState<Handlers[]>([]);

  const subscribe = useCallback(
    (handlers: Handlers) => {
      setSubscribers((subs) => [...subs, handlers]);
      return () => {
        setSubscribers((subs) =>
          subs.filter((handler) => handler !== handlers)
        );
      };
    },
    [setSubscribers]
  );

  const swipeRightEnabled = Boolean(leftOption);
  const swipeLeftEnabled = Boolean(rightOption);

  const translateX = useSharedValue(0);
  const subsTranslateX = useDerivedValue(() => translateX.value);

  const context = useSharedValue<SwipeableRowGestureContext>({ startX: 0 });

  const panGesture = useMemo(() => {
    const broadcast = (
      event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
      name: keyof Handlers
    ) => {
      "worklet";
      subscribers.forEach((handler) => {
        handler[name]?.(event);
      });
    };

    return Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onBegin((event) => {
        broadcast(event, "onBegin");
      })
      .onStart((event) => {
        context.value.startX = translateX.value;
        broadcast(event, "onStart");
      })
      .onEnd((event) => {
        translateX.value = withTiming(0, { easing: Easing.out(Easing.cubic) });
        broadcast(event, "onEnd");
      })
      .onFinalize((event) => {
        broadcast(event, "onFinalize");
      })
      .onUpdate((event) => {
        if (event.translationX > context.value.startX && swipeRightEnabled) {
          translateX.value = context.value.startX + event.translationX;
        } else if (
          event.translationX < context.value.startX &&
          swipeLeftEnabled
        ) {
          translateX.value = context.value.startX + event.translationX;
        }

        subscribers.forEach((handler) => {
          handler.onUpdate?.(event);
        });
      });
  }, [subscribers]);

  const rowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.swipeableRow]}>
      <View style={styles.optionsContainer}>
        <SwipeableRowProvider translateX={subsTranslateX} subscribe={subscribe}>
          <Animated.View style={[styles.option, styles.left]}>
            {leftOption}
          </Animated.View>
          <Animated.View style={[styles.option, styles.right]}>
            {rightOption}
          </Animated.View>
        </SwipeableRowProvider>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={rowStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeableRow: {
    overflow: "hidden",
  },
  optionsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  option: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
});
