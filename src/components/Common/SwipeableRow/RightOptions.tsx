/* Courtesy https://github.com/beardwin/ */

import React, { useCallback, useEffect, useState } from 'react';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { useSwipeableRow } from './SwipeableRowProvider';
import { ISwipeableColors } from './types';
import { playHaptic } from '@helpers/haptics';

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [75, 150];
const [firstStop, secondStop] = DEFAULT_STOPS;

interface Props {
  colors: ISwipeableColors;
  onFirst: () => unknown;
  onSecond?: () => unknown;
  flipFlop?: boolean;
  firstIcon: React.NamedExoticComponent<any>;
  secondIcon?: React.NamedExoticComponent<any>;
}

const buzz = (): void => {
  'worklet';

  runOnJS(playHaptic)();
};

export function RightOptions({
  colors,
  onFirst,
  onSecond,
  flipFlop = false,
  firstIcon,
  secondIcon,
}: Props): React.JSX.Element {
  const isFrozen = useSharedValue(false);
  const { subscribe, translateX } = useSwipeableRow();
  const [RenderIcon, setRenderIcon] =
    useState<React.NamedExoticComponent<any>>(firstIcon);

  useEffect(
    () =>
      subscribe({
        onStart: () => {
          'worklet';

          isFrozen.value = false;
        },
        onEnd: () => {
          'worklet';

          if (translateX.value >= secondStop) {
            if (onFirst == null) return;

            runOnJS(onFirst)();
          } else if (translateX.value >= firstStop) {
            if (onSecond == null) return;

            runOnJS(onSecond)();
          }
          isFrozen.value = true;
        },
      }),
    [onFirst, onSecond],
  );

  // The timer used for the rotation animation
  const rotationTimer = useSharedValue(0);

  // The timer used to pulse the arrow to indicate it's active
  const pulseTimer = useSharedValue(0);

  // Triggers a 180 degree rotation animation when the user
  // drags across the appropriate threshold.
  useAnimatedReaction(
    () => ({ translateX: translateX.value, isFrozen: isFrozen.value }),
    (current, previous) => {
      if (current.isFrozen) return;

      const hitFirstStop =
        previous != null &&
        ((current.translateX >= firstStop && previous.translateX < firstStop) ||
          (current.translateX < firstStop && previous.translateX >= firstStop));

      const hitSecondStop =
        current.translateX >= secondStop &&
        previous != null &&
        previous.translateX < secondStop;

      if (hitFirstStop) {
        buzz();
        pulseTimer.value = withTiming(1, { duration: 250 }, () => {
          pulseTimer.value = 0;
        });
      }

      if (onSecond != null && secondIcon != null) {
        if (hitSecondStop) {
          buzz();
          runOnJS(setRenderIcon)(secondIcon);
        } else if (
          current.translateX <= secondStop &&
          previous != null &&
          previous.translateX >= secondStop
        ) {
          buzz();
          runOnJS(setRenderIcon)(firstIcon);
        }
      }
    },
    [colors],
  );

  /**
   * Controls the shifting of the background color
   * as a user swipes the row
   */
  const backgroundStyle = useAnimatedStyle(() => {
    if (isFrozen.value) return {};

    const backgroundColor = interpolateColor(
      Math.abs(translateX.value),
      [0, firstStop / 2, firstStop * 1.5, secondStop],
      ['transparent', colors.first, colors.first, colors.second],
    );

    const width = translateX.value;
    return { backgroundColor, width };
  });

  /**
   * Controls the arrow's scale and rotation
   */
  const arrowStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, firstStop * 0.8],
      [0.4, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {
          scale,
        },
        {
          rotate: `${rotationTimer.value}deg`,
        },
      ],
    };
  });

  const pulse = useAnimatedStyle(() => {
    if (translateX.value < firstStop * 0.99) return {};

    const scale = interpolate(
      pulseTimer.value,
      [0, 0.5, 1],
      [1, 1.75, 1],
      Extrapolate.CLAMP,
    );

    return { transform: [{ scale }] };
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {}, []);

  return (
    <>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={[styles.option]}>
        <Animated.View style={[pulse]}>
          <Animated.View
            style={[styles.option, arrowStyle]}
            onLayout={onLayout}
          >
            <RenderIcon />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
