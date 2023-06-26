import { useState } from "react";
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
  onRightLeftTwo: () => void | Promise<void>;
  leftRightOneIcon: any;
  leftRightTwoIcon: any;
  rightLeftOneIcon: any;
  rightLeftTwoIcon: any;
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
  const [color, setColor] = useState(theme.colors.app.upvote);
  const [rightIcon, setRightIcon] = useState<any>(options.rightLeftOneIcon);
  const [leftIcon, setLeftIcon] = useState<any>(options.leftRightOneIcon);

  // Other
  const { width } = Dimensions.get("screen");

  const translateX = useSharedValue(0);
  const ranFeedbackUpvote = useSharedValue(false);
  const ranFeedbackDownvote = useSharedValue(false);
  const ranFeedbackComment = useSharedValue(false);
  const startPos = useSharedValue(0);
  const action = useSharedValue<
    null | "leftRightOne" | "leftRightTwo" | "rightLeftOne" | "rightLeftTwo"
  >(null);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      ctx.startX = translateX.value;
      startPos.value = event.absoluteX;
    },
    onActive: (event, ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      translateX.value = ctx.startX + event.translationX;

      if (event.translationX > 0) {
        if (event.translationX < width * 0.3) {
          runOnJS(setStyles)("leftRightOne");
        } else {
          runOnJS(setStyles)("leftRightTwo");
        }
      } else {
        runOnJS(setStyles)("rightLeftOne");
      }

      if (event.translationX >= width * 0.15 && !ranFeedbackUpvote.value) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackUpvote.value = true;
      } else if (
        event.translationX >= width * 0.3 &&
        !ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = true;
      } else if (
        event.translationX >= width * 0.15 &&
        event.translationX < width * 0.3 &&
        ranFeedbackUpvote.value &&
        ranFeedbackDownvote.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackDownvote.value = false;
      } else if (
        event.translationX < 0 &&
        event.translationX <= width * 0.15 &&
        !ranFeedbackComment.value
      ) {
        runOnJS(onCommentSlideHapticFeedback)();
        ranFeedbackComment.value = true;
      }
    },
    onEnd: (event) => {
      ranFeedbackUpvote.value = false;
      ranFeedbackDownvote.value = false;
      ranFeedbackComment.value = false;

      runOnJS(setStyles)("upvote");

      if (
        event.translationX >= width * 0.15 &&
        event.translationX < width * 0.3
      ) {
        runOnJS(onDone)("leftRightOne");
      } else if (event.translationX >= width * 0.3) {
        runOnJS(onDone)("leftRightTwo");
      } else if (event.translationX <= -(width * 0.15)) {
        runOnJS(onDone)("rightLeftOne");
      }

      translateX.value = withSpring(0, {
        damping: 30,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function setStyles(actionType) {
    switch (actionType) {
      case "leftRightOne": {
        if (color === theme.colors.app.upvote) return;
        setColor(theme.colors.app.upvote);
        setLeftIcon(options.leftRightOneIcon);
        break;
      }
      case "leftRightTwo": {
        if (color === theme.colors.app.downvote) return;
        setColor(theme.colors.app.downvote);
        setLeftIcon(options.leftRightTwoIcon);
        break;
      }
      case "rightLeftOne": {
        if (color === theme.colors.app.success) return;
        setColor(theme.colors.app.success);
        setRightIcon(options.rightLeftOneIcon);
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
    color,
    gestureHandler,
    animatedStyle,
  };
};

export default useSwipeAnimation;
