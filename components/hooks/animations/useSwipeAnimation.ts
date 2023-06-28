import { useEffect, useState } from "react";
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import { useTheme } from "native-base";
import { onCommentSlideHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";

interface UseSwipeAnimationOptions {
  onLeftRightOne: () => void | Promise<void>;
  onLeftRightTwo: () => void | Promise<void>;
  onRightLeftOne: () => void | Promise<void>;
  onRightLeftTwo?: () => void | Promise<void>;
  leftRightOneIcon: any;
  leftRightTwoIcon: any;
  rightLeftOneIcon: any;
  rightLeftTwoIcon?: any;
}

interface UseSwipeAnimation {
  color: string;
  leftIcon: any;
  rightIcon: any;
  gestureHandler: any;
  animatedStyle: { transform: { translateX: number }[] };
}

const useSwipeAnimation = (
  options: UseSwipeAnimationOptions
): UseSwipeAnimation => {
  const theme = useTheme();
  // State
  const color = useSharedValue(theme.colors.app.upvote);
  // const rightIcon = useSharedValue(options.rightLeftOneIcon);
  // const leftIcon = useSharedValue(options.leftRightOneIcon);

  const [rightIcon, setRightIcon] = useState(options.rightLeftTwoIcon);
  const [leftIcon, setLeftIcon] = useState(options.leftRightOneIcon);

  // Other
  const { width } = Dimensions.get("screen");

  const translateX = useSharedValue(0);
  const ranFeedbackUpvote = useSharedValue(false);
  const ranFeedbackDownvote = useSharedValue(false);
  const ranFeedbackComment = useSharedValue(false);
  const ranFeedbackMarkRead = useSharedValue(false);
  const startPos = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      ctx.startX = translateX.value;
      startPos.value = event.absoluteX;
      color.value = theme.colors.app.upvote;
    },
    onActive: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      translateX.value = ctx.startX + event.translationX;

      if (event.translationX > 0) {
        if (event.translationX < width * 0.32) {
          runOnJS(setStyles)("leftRightOne");
        } else {
          runOnJS(setStyles)("leftRightTwo");
        }
      } else if (event.translationX < 0) {
        if (-event.translationX < width * 0.3) {
          runOnJS(setStyles)("rightLeftOne");
        } else {
          runOnJS(setStyles)("rightLeftTwo");
        }
      }

      if (event.translationX >= width * 0.17 && !ranFeedbackUpvote.value) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackUpvote.value = true;
      } else if (
        event.translationX >= width * 0.32 &&
        !ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = true;
      } else if (
        event.translationX >= width * 0.17 &&
        event.translationX < width * 0.32 &&
        ranFeedbackUpvote.value &&
        ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = false;
      } else if (event.translationX < 0) {
        if (-event.translationX >= width * 0.17 && !ranFeedbackComment.value) {
          runOnJS(onCommentSlideHapticFeedback)();
          ranFeedbackComment.value = true;
        } else if (
          -event.translationX >= width * 0.32 &&
          !ranFeedbackMarkRead.value
        ) {
          runOnJS(onCommentSlideHapticFeedback)();
          ranFeedbackMarkRead.value = true;
        } else if (
          -event.translationX >= width * 0.17 &&
          -event.translationX < width * 0.32 &&
          ranFeedbackComment.value &&
          ranFeedbackMarkRead.value
        ) {
          runOnJS(onCommentSlideHapticFeedback)();
          ranFeedbackMarkRead.value = false;
        }
      }
    },
    onEnd: (event) => {
      ranFeedbackUpvote.value = false;
      ranFeedbackDownvote.value = false;
      ranFeedbackComment.value = false;

      if (
        event.translationX >= width * 0.17 &&
        event.translationX < width * 0.32
      ) {
        runOnJS(onDone)("leftRightOne");
      } else if (event.translationX >= width * 0.32) {
        runOnJS(onDone)("leftRightTwo");
      } else if (event.translationX < 0) {
        if (
          -event.translationX >= width * 0.17 &&
          -event.translationX < width * 0.32
        ) {
          runOnJS(onDone)("rightLeftOne");
        } else if (-event.translationX >= width * 0.32) {
          runOnJS(onDone)("rightLeftTwo");
        }
      }

      translateX.value = withSpring(0, {
        damping: 20,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function setStyles(actionType) {
    switch (actionType) {
      case "leftRightOne": {
        if (color.value === theme.colors.app.upvote) return;
        color.value = theme.colors.app.upvote;
        setLeftIcon(options.leftRightOneIcon);
        break;
      }
      case "leftRightTwo": {
        if (color.value === theme.colors.app.downvote) return;
        color.value = theme.colors.app.downvote;
        setLeftIcon(options.leftRightTwoIcon);
        break;
      }
      case "rightLeftOne": {
        if (color.value === theme.colors.app.info) return;
        color.value = theme.colors.app.info;
        setRightIcon(options.rightLeftOneIcon);
        break;
      }
      case "rightLeftTwo": {
        if (!options.onRightLeftTwo) return;

        if (color.value === theme.colors.app.infoBorder) return;
        color.value = theme.colors.app.infoBorder;
        setRightIcon(options.rightLeftTwoIcon);
        break;
      }
      default: {
        break;
      }
    }
  }

  function onDone(
    actionType:
      | null
      | "leftRightOne"
      | "leftRightTwo"
      | "rightLeftOne"
      | "rightLeftTwo"
  ) {
    switch (actionType) {
      case "leftRightOne": {
        options.onLeftRightOne();
        break;
      }
      case "leftRightTwo": {
        options.onLeftRightTwo();
        break;
      }
      case "rightLeftOne": {
        options.onRightLeftOne();
        break;
      }
      case "rightLeftTwo": {
        if (!options.onRightLeftTwo) return;

        options.onRightLeftTwo();
        break;
      }
      default: {
        break;
      }
    }
  }

  return {
    leftIcon,
    rightIcon,
    color: color.value,
    gestureHandler,
    animatedStyle,
  };
};

export default useSwipeAnimation;
