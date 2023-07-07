import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { trigger } from "react-native-haptic-feedback";
import { StyleSheet, ColorValue, LayoutRectangle, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSwipeableRow } from "../SwipeableRowProvider";
import { IconArrowUp } from "tabler-icons-react-native";
import { ILemmyVote } from "../../../../../lemmy/types/ILemmyVote";
import { getUniqueID } from "@ronradtke/react-native-markdown-display";

interface VoteColor {
  background: ColorValue;
}

type VoteColors = {
  upvote: VoteColor;
  downvote: VoteColor;
};

const DEFAULT_VOTE_COLORS: VoteColors = {
  upvote: {
    background: "orange",
  },
  downvote: {
    background: "blue",
  },
};

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [75, 125];

interface Props {
  stops?: Stops;
  voteColors?: VoteColors;
  vote?: number;
  onUpVote: () => void;
  onDownVote: () => void;
}

const buzz = () => {
  "worklet";
  runOnJS(trigger)("medium");
};

export const VoteOption = ({
  stops = DEFAULT_STOPS,
  voteColors = DEFAULT_VOTE_COLORS,
  vote = 0,
  onUpVote,
  onDownVote,
}: Props) => {
  const [firstStop, secondStop] = stops;
  const [first, second] =
    vote === -1
      ? [voteColors.downvote, voteColors.upvote]
      : [voteColors.upvote, voteColors.downvote];

  // Provides UI thread access to the current vote as it changes.
  const currentVote = useDerivedValue<number>(() => vote);

  // shared value to freeze animations when a user lets go
  const isFrozen = useSharedValue(false);

  const [arrow, setArrow] = useState<LayoutRectangle | null>(null);
  const { subscribe, translateX } = useSwipeableRow();

  useEffect(() => {
    /**
     * Plugin to the SwipeableRow gestures. This allows us to
     * fire events and do whatever we want.
     *
     * These *must* be marked as worklets, as they'll be executed
     * on the main thread.
     */
    return subscribe({
      onStart: () => {
        "worklet";
        isFrozen.value = false;
      },
      onEnd: (event) => {
        "worklet";
        isFrozen.value = true;
        if (event.translationX >= secondStop) {
          runOnJS(currentVote.value === -1 ? onUpVote : onDownVote)();
        } else if (event.translationX >= firstStop) {
          runOnJS(currentVote.value === -1 ? onDownVote : onUpVote)();
        }
      },
    });
  }, [subscribe, onUpVote, onDownVote, firstStop, secondStop]);

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

      const slidBackFromSecondStop =
        current.translateX <= secondStop &&
        previous &&
        previous.translateX >= secondStop;

      if (hitFirstStop) {
        buzz();
      }

      if (hitSecondStop) {
        buzz();
        rotationTimer.value = withSpring(rotationTimer.value + 180, {
          damping: 12,
        });
      } else if (slidBackFromSecondStop) {
        buzz();
        rotationTimer.value = withSpring(rotationTimer.value - 180, {
          damping: 12,
        });
      } else if (current.translateX === 0) {
        rotationTimer.value = currentVote.value === -1 ? 180 : 0;
      }
    },
    [first, second, firstStop, secondStop]
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
        first.background as string,
        first.background as string,
        second.background as string,
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

  /**
   * Provides an offset to the arrow, which makes it look and feel
   * as though the user is dragging it from off the screen.
   */
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
          <IconArrowUp size={24} color="#fff" />
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderwidth: 1,
  },
});
