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
} from "react-native-reanimated";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, LayoutRectangle, StyleSheet } from "react-native";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { ISwipeableColors } from "./types";
import { useSwipeableRow } from "./SwipeableRowProvider";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

type Stops = [first: number, second: number];
const DEFAULT_STOPS: Stops = [-75, -150];

export type ReplyOptionIcon = "comment" | "Save" | "read" | "Collapse";

interface Props {
  stops?: Stops;
  onReply: () => unknown;
  onExtra?: () => unknown;
  extraType?: ReplyOptionIcon | undefined;
}

const buzz = () => {
  "worklet";

  runOnJS(onGenericHapticFeedback)();
};

const bookmarkIcon = <SFIcon icon={ICON_MAP.SAVE} color="white" size={14} />;
const mailOpenedIcon = (
  <SFIcon icon={ICON_MAP.MAIL_OPENED} color="white" size={14} />
);
const commentIcon = <SFIcon icon={ICON_MAP.REPLY} color="white" size={14} />;
const collapseIcon = (
  <SFIcon icon={ICON_MAP.COLLAPSE} color="white" size={14} />
);

const screenWidth = Dimensions.get("screen").width;

export function ReplyOption({
  stops = DEFAULT_STOPS,
  onReply,
  onExtra,
  extraType,
}: Props) {
  const theme = useThemeOptions();

  const [firstStop, secondStop] = stops;

  const secondColorMap: Record<ReplyOptionIcon, string> = {
    comment: theme.colors.info,
    Save: theme.colors.bookmark,
    read: theme.colors.success,
    Collapse: theme.colors.accent,
  };

  const secondColor = secondColorMap[extraType ?? "comment"];

  const colors: ISwipeableColors = useMemo(
    () => ({
      first: theme.colors.infoText,
      second: secondColor,
    }),
    [theme, secondColor]
  );

  // The timer used to pulse the icon to indicate it's active
  const pulseTimer = useSharedValue(0);
  const isFrozen = useSharedValue(false);
  const [iconRect, setIconRect] = useState<LayoutRectangle | null>(null);
  const [icon, setIcon] = useState<ReplyOptionIcon>("comment");
  const { subscribe, translateX } = useSwipeableRow();

  useEffect(
    () =>
      subscribe({
        onStart: () => {
          "worklet";

          runOnJS(setIcon)("comment");
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
      }),
    [onReply, onExtra]
  );

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
        pulseTimer.value = withTiming(1, { duration: 250 }, () => {
          pulseTimer.value = 0;
        });
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

    const lastColor = onExtra ? colors.second : colors.first;

    const backgroundColor = interpolateColor(
      Math.abs(translateX.value),
      [0, -firstStop / 2, -firstStop * 1.5, -secondStop],
      [
        "transparent",
        colors.first as string,
        colors.first as string,
        lastColor as string,
      ]
    );

    const width = screenWidth - translateX.value;
    const transform = [{ translateX: translateX.value }];

    return { backgroundColor, width, transform };
  });

  const iconOffset = useAnimatedStyle(() => {
    const width = iconRect?.width ?? 0;

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

  const pulse = useAnimatedStyle(() => {
    if (translateX.value > firstStop * 0.99) return {};

    const scale = interpolate(
      pulseTimer.value,
      [0, 0.5, 1],
      [1, 1.75, 1],
      Extrapolate.CLAMP
    );

    return { transform: [{ scale }] };
  });

  return (
    <>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <Animated.View style={[styles.option, iconOffset]}>
        <Animated.View style={pulse}>
          <Animated.View
            style={[styles.option, iconScale]}
            onLayout={(event) => {
              setIconRect(event.nativeEvent.layout);
            }}
          >
            {(icon === "comment" && commentIcon) ||
              (icon === "Save" && bookmarkIcon) ||
              (icon === "read" && mailOpenedIcon) ||
              (icon === "Collapse" && collapseIcon)}
          </Animated.View>
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
  },
});
