/* Courtesy https://github.com/beardwin/ */

import React, { useCallback, useEffect, useState } from "react";
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
  PanGestureHandler,
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
  // eslint-disable-next-line react/no-unused-prop-types
  translateX?: SharedValue<number>;

  /**
   * The component which will pan right and left as the user drags
   */
  children: React.ReactNode;
}

export function SwipeableRow({ leftOption, rightOption, children }: Props) {
  const [leftSubscribers, setLeftSubscribers] = useState<Handlers[]>([]);
  const [rightSubscribers, setRightSubscribers] = useState<Handlers[]>([]);

  const swipeRightEnabled = Boolean(leftOption);
  const swipeLeftEnabled = Boolean(rightOption);

  const translateX = useSharedValue(0);
  const subsTranslateX = useDerivedValue(() => translateX.value);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    SwipeableRowGestureContext
  >(
    {
      onStart: (event, ctx) => {
        ctx.startX = translateX.value;
        leftSubscribers.forEach((handler) => {
          handler.onStart?.(event, ctx);
        });
        rightSubscribers.forEach((handler) => {
          handler.onStart?.(event, ctx);
        });
      },
      onActive: (event, ctx) => {
        if (event.translationX > ctx.startX && swipeRightEnabled) {
          translateX.value = ctx.startX + event.translationX;
        } else if (event.translationX < ctx.startX && swipeLeftEnabled) {
          translateX.value = ctx.startX + event.translationX;
        }
        leftSubscribers.forEach((handler) => {
          handler.onActive?.(event, ctx);
        });
        rightSubscribers.forEach((handler) => {
          handler.onActive?.(event, ctx);
        });
      },
      onCancel: (event, ctx) => {
        leftSubscribers.forEach((handler) => {
          handler.onCancel?.(event, ctx);
        });
        rightSubscribers.forEach((handler) => {
          handler.onCancel?.(event, ctx);
        });
      },
      onFail: (event, ctx) => {
        leftSubscribers.forEach((handler) => {
          handler.onFail?.(event, ctx);
        });
        rightSubscribers.forEach((handler) => {
          handler.onFail?.(event, ctx);
        });
      },
      onEnd: (event, ctx) => {
        translateX.value = withTiming(0, { easing: Easing.out(Easing.cubic) });
        leftSubscribers.forEach((handler) => {
          handler.onEnd?.(event, ctx);
        });
        rightSubscribers.forEach((handler) => {
          handler.onEnd?.(event, ctx);
        });
      },
    },
    [leftSubscribers, rightSubscribers]
  );

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.swipeableRow]}>
      <View style={styles.optionsContainer}>
        <SwipeableRowProvider
          translateX={subsTranslateX}
          setLeftSubscribers={setLeftSubscribers}
          setRightSubscribers={setRightSubscribers}
        >
          <Animated.View style={[styles.option, styles.left]}>
            {leftOption}
          </Animated.View>
          <Animated.View style={[styles.option, styles.right]}>
            {rightOption}
          </Animated.View>
        </SwipeableRowProvider>
      </View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        minPointers={1}
        activeOffsetX={[-20, 20]}
        hitSlop={{ left: -25 }}
      >
        <Animated.View style={rowStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </View>
  );
}

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
