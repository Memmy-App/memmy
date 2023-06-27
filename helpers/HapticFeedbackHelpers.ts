import { trigger } from "react-native-haptic-feedback";
import { Platform } from "react-native";
import store from "../store";

const getHapticSettings = () => {
  const hapticSetting = store.getState().settings.haptics;

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

export const onVoteHapticFeedback = () => {
  setTimeout(() => {
    trigger("soft");
  }, 25);

  trigger(getHapticSettings());
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
    trigger(getHapticSettings());
  }

  if (Platform.OS === "android") {
    trigger(getHapticSettings());
  }
};

export const onGenericHapticFeedback = () => {
  if (Platform.OS === "ios") {
    trigger(getHapticSettings());
  } else {
    trigger("effectClick");
  }
};
