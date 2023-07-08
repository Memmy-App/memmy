import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import {
  IconBookmark,
  IconMailOpened,
  IconMessage,
} from "tabler-icons-react-native";
import { Dimensions, LayoutRectangle, StyleSheet } from "react-native";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { ISwipeableColors } from "./types";
import { useSwipeableRow } from "./SwipeableRowProvider";

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [-75, -125];

type Icon = "comment" | "save" | "read";

interface Props {
  stops?: Stops;
  onReply: () => unknown;
  onExtra?: () => unknown;
  extraType?: Icon | undefined;
  id: number;
}

const buzz = () => {
  "worklet";

  runOnJS(onGenericHapticFeedback)();
};

const bookmarkIcon = <IconBookmark color="white" size={24} />;
const mailOpenedIcon = <IconMailOpened color="white" size={24} />;
const commentIcon = <IconMessage color="white" size={24} />;

const screenWidth = Dimensions.get("screen").width;

export function ReplyOption({
  stops = DEFAULT_STOPS,
  onReply,
  onExtra,
  extraType,
  id,
}: Props) {
  const theme = useTheme();

  const [firstStop, secondStop] = stops;

  const colors: ISwipeableColors = useMemo(() => {
    return {
      first: theme.colors.app.info,
      second: theme.colors.app.success,
    };
  }, [theme]);

  const isFrozen = useSharedValue(false);
  const [iconRect, setIconRect] = useState<LayoutRectangle | null>(null);
  const [icon, setIcon] = useState<Icon>("comment");
  const { subscribe, translateX } = useSwipeableRow();

  useEffect(() => {
    return subscribe({
      onStart: () => {
        "worklet";

        isFrozen.value = false;
      },
      onEnd: () => {
        "worklet";

        if (onExtra && translateX.value <= secondStop) {
          runOnJS(onExtra)();
        } else if (translateX.value <= firstStop) {
          runOnJS(onReply)();
        }
        isFrozen.value = true;
      },
    });
  }, [onReply, onExtra]);

  useAnimatedReaction(
    () => ({ translateX: translateX.value, isFrozen: isFrozen.value }),
    (current, previous) => {
      if (current.isFrozen) return;

      const hitFirstStop =
        previous &&
        ((current.translateX <= firstStop && previous.translateX > firstStop) ||
          (current.translateX > firstStop && previous.translateX <= firstStop));

      const hitSecondStop =
        current.translateX <= secondStop &&
        previous &&
        previous.translateX > secondStop;

      if (hitFirstStop) {
        buzz();
      }

      if (hitSecondStop && onExtra) {
        buzz();
        runOnJS(setIcon)(extraType);
      } else if (
        onExtra &&
        current.translateX >= secondStop &&
        previous &&
        previous.translateX <= secondStop
      ) {
        buzz();
        runOnJS(setIcon)("comment");
      }
    },
    [colors, onExtra, setIcon]
  );

  const backgroundStyle = useAnimatedStyle(() => {
    if (isFrozen.value) return {};

    const backgroundColor = interpolateColor(
      Math.abs(translateX.value),
      [-secondStop, -firstStop * 1.5, -firstStop / 2, 0],
      [
        colors.second as string,
        colors.first as string,
        colors.first as string,
        "transparent",
      ]
    );

    const width = screenWidth - translateX.value;
    const transform = [{ translateX: translateX.value }];

    return { backgroundColor, width, transform };
  });

  const iconOffset = useAnimatedStyle(() => {
    let width = iconRect?.width ?? 0;

    const xOffset = interpolate(
      translateX.value,
      [secondStop, firstStop, 0],
      [(secondStop + width) / 2, (firstStop + width) / 2, width]
    );

    return {
      transform: [{ translateX: xOffset }],
    };
  }, [iconRect]);

  const iconScale = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, firstStop * 0.8],
      [0.4, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={[styles.option, iconOffset]}>
        <Animated.View
          style={[styles.option, iconScale]}
          onLayout={(event) => {
            setIconRect(event.nativeEvent.layout);
          }}
        >
          {(icon === "comment" && commentIcon) ||
            (icon === "save" && bookmarkIcon) ||
            (icon === "read" && mailOpenedIcon)}
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
