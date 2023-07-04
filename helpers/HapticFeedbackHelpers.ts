import { trigger } from "react-native-haptic-feedback";
import { Platform } from "react-native";
import store from "../store";

const getHapticFeedbackType = () => {
  const hapticSetting = store.getState().settings.haptics;

  if (hapticSetting === "Off") return null;

  if (Platform.OS === "android") {
    if (hapticSetting === "Heavy") {
      return "effectHeavyClick";
    }

    return "effectClick";
  }

  switch (hapticSetting) {
    case "Light":
      return "impactLight";
    case "Medium":
      return "impactMedium";
    case "Heavy":
      return "impactHeavy";
    default:
      return "impactHeavy";
  }
};

const doHapticFeedback = (feedbackType) => {
  if (feedbackType) trigger(feedbackType);
};

export const onVoteHapticFeedback = () => {
  const feedbackType = getHapticFeedbackType();

  if (!feedbackType) return;

  setTimeout(() => {
    doHapticFeedback("soft");
  }, 250);

  doHapticFeedback(feedbackType);
};

// these two are for if we need a different feedback for upvotes and downvotes
export const onUpvoteHapticFeedback = () => {
  onVoteHapticFeedback();
};

export const onDownVoteHapticFeedback = () => {
  onVoteHapticFeedback();
};

export const onCommentSlideHapticFeedback = () => {
  if (Platform.OS === "ios") {
    doHapticFeedback(getHapticFeedbackType());
  }

  if (Platform.OS === "android") {
    doHapticFeedback(getHapticFeedbackType());
  }
};

export const onGenericHapticFeedback = () => {
  const feedbackType = getHapticFeedbackType();

  if (!feedbackType) return;

  if (Platform.OS === "ios") {
    doHapticFeedback(getHapticFeedbackType());
  } else {
    doHapticFeedback("effectClick");
  }
};
