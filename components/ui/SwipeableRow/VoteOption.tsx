/* Courtesy https://github.com/beardwin/ */

import React, { useEffect, useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { LayoutRectangle, StyleSheet } from "react-native";
import { useTheme } from "native-base";
import { useSwipeableRow } from "./SwipeableRowProvider";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [75, 125];

interface Props {
  stops?: Stops;
  vote?: number;
  onVote: (value: number) => unknown;
}

interface Colors {
  first: string;
  second: string;
}

const buzz = () => {
  "worklet";

  runOnJS(onGenericHapticFeedback)();
};

export function VoteOption({ stops = DEFAULT_STOPS, vote = 0, onVote }: Props) {
  const theme = useTheme();

  const [firstStop, secondStop] = stops;

  const [colors, setColors] = useState<Colors>(
    vote === -1
      ? {
          first: theme.colors.app.downvote,
          second: theme.colors.app.upvote,
        }
      : {
          first: theme.colors.app.upvote,
          second: theme.colors.app.downvote,
        }
  );

  const isFrozen = useSharedValue(false);
  const [arrow, setArrow] = useState<LayoutRectangle | null>(null);
  const { subscribe, translateX } = useSwipeableRow();

  const voteRef = useSharedValue(vote);

  useEffect(() => {
    voteRef.value = vote;

    setColors(
      vote === -1
        ? {
            first: theme.colors.app.downvote,
            second: theme.colors.app.upvote,
          }
        : {
            first: theme.colors.app.upvote,
            second: theme.colors.app.downvote,
          }
    );
  }, [vote]);

  useEffect(() => {
    subscribe({
      onStart: () => {
        "worklet";

        isFrozen.value = false;
      },
      onEnd: () => {
        "worklet";

        if (translateX.value >= secondStop) {
          runOnJS(onVote)(voteRef.value === -1 ? 1 : -1);
        } else if (translateX.value >= firstStop) {
          runOnJS(onVote)(voteRef.value === -1 || voteRef.value === 1 ? 0 : 1);
        }
        isFrozen.value = true;
      },
    });
  }, [subscribe]);

  // The timer used for the rotation animation
  const rotationTimer = useSharedValue(0);

  // Triggers a 180 degree rotation animation when the user
  // drags across the appropriate threshold.
  useAnimatedReaction(
    () => ({ translateX: translateX.value, isFrozen: isFrozen.value }),
    (current, previous) => {
      if (current.isFrozen) return;

      const hitFirstStop =
        previous &&
        ((current.translateX >= firstStop && previous.translateX < firstStop) ||
          (current.translateX < firstStop && previous.translateX >= firstStop));

      const hitSecondStop =
        current.translateX >= secondStop &&
        previous &&
        previous.translateX < secondStop;

      if (hitFirstStop) {
        buzz();
      }

      if (hitSecondStop) {
        buzz();
        rotationTimer.value = withSpring(rotationTimer.value + 180, {
          damping: 12,
        });
      } else if (
        current.translateX <= secondStop &&
        previous &&
        previous.translateX >= secondStop
      ) {
        buzz();
        rotationTimer.value = withSpring(rotationTimer.value - 180, {
          damping: 12,
        });
      } else if (current.translateX === 0) {
        rotationTimer.value = vote === -1 ? 180 : 0;
      }
    },
    [colors]
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
      [
        "transparent",
        colors.first as string,
        colors.first as string,
        colors.second as string,
      ]
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
      Extrapolation.CLAMP
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

  const arrowOffset = useAnimatedStyle(() => {
    const xOffset = interpolate(
      translateX.value,
      [0, firstStop, secondStop],
      [
        -(arrow?.width ?? 0),
        (firstStop - (arrow?.width ?? 0)) / 2,
        (secondStop - (arrow?.width ?? 0)) / 2,
      ]
    );

    return {
      transform: [{ translateX: xOffset }],
    };
  }, [arrow]);

  return (
    <>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={[styles.option, arrowOffset]}>
        <Animated.View
          style={[styles.option, arrowStyle]}
          onLayout={(event) => {
            setArrow(event.nativeEvent.layout);
          }}
        >
          <AntDesign name="arrowup" size={24} color="white" />
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
});
