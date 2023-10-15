/* Courtesy https://github.com/beardwin/ */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { playHaptic } from '@helpers/haptics';
import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions';
import { useSwipeableRow } from '@components/Common/SwipeableRow/SwipeableRowProvider';
import { IconMap, IconType } from '@src/types/IconMap';
import { styled } from 'tamagui';
import { ISwipeableOptions } from '@components/Common/SwipeableRow/types';

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [75, 150];
const [firstStop, secondStop] = DEFAULT_STOPS;

interface Props {
  options: ISwipeableOptions;
  flipFlop?: boolean;
  actionParams: SwipeableActionParams;
}

const buzz = (): void => {
  'worklet';

  runOnJS(playHaptic)();
};

export function LeftOptions({
  options,
  flipFlop = false,
  actionParams,
}: Props): React.JSX.Element {
  const isFrozen = useSharedValue(false);
  const { subscribe, translateX } = useSwipeableRow();

  const { colors, actions, icons } = options;

  const [icon, setIcon] = useState<IconType | undefined>(icons.first);

  // We need to do this because functions passed from a worklet using runOnJS are converted to objects
  const runAction = useCallback(
    (actionType: 'first' | 'second') => {
      if (actionType === 'first' && actions.first != null) {
        actions.first(actionParams);
      } else if (actionType === 'second' && actions.second != null) {
        actions.second(actionParams);
      }
    },
    [options.actions],
  );

  const RenderIcon = useMemo(
    () =>
      icon != null
        ? styled(IconMap[icon], { color: 'white', size: 40, marginRight: 5 })
        : null,
    [icon],
  );

  const resetIcon = useCallback(() => {
    setTimeout(() => {
      setIcon(icons.first);
    }, 250);
  }, [icon]);

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
            if (actions.second == null) return;

            runOnJS(runAction)('second');
            runOnJS(resetIcon)();
          } else if (translateX.value >= firstStop) {
            if (actions.first == null) return;

            runOnJS(runAction)('first');
            runOnJS(resetIcon)();
          }
          isFrozen.value = true;
        },
      }),
    [actions],
  );

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

      if (actions.second != null && icons.second != null) {
        if (hitSecondStop) {
          buzz();
          runOnJS(setIcon)(icons.second);
        } else if (
          current.translateX <= secondStop &&
          previous != null &&
          previous.translateX >= secondStop
        ) {
          buzz();
          runOnJS(setIcon)(icons.first);
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

    const backgroundColor =
      colors.second != null
        ? interpolateColor(
            Math.abs(translateX.value),
            [0, firstStop / 2, firstStop * 1.5, secondStop],
            ['transparent', colors.first, colors.first, colors.second],
          )
        : colors.first;

    const width = translateX.value;
    return { backgroundColor, width };
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

  return (
    <>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={[styles.option]}>
        <Animated.View style={[pulse]}>
          <Animated.View style={[styles.option]}>
            {RenderIcon != null && <RenderIcon />}
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
