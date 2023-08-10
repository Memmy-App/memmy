import { trigger } from "react-native-haptic-feedback";
import { Platform } from "react-native";
import { useSettingsStore } from "@src/state/settings/settingsStore";

const getHapticFeedbackType = () => {
  const hapticSetting = useSettingsStore.getState().haptics;

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

const doHapticFeedback = (feedbackType: string | null): void => {
  if (feedbackType) trigger(feedbackType);
};

export const onVoteHapticFeedback = (): void => {
  const feedbackType = getHapticFeedbackType();

  if (!feedbackType) return;

  setTimeout(() => {
    doHapticFeedback("soft");
  }, 250);

  doHapticFeedback(feedbackType);
};

// these two are for if we need a different feedback for upvotes and downvotes
export const onUpvoteHapticFeedback = (): void => {
  onVoteHapticFeedback();
};

export const onDownVoteHapticFeedback = (): void => {
  onVoteHapticFeedback();
};

export const onCommentSlideHapticFeedback = (): void => {
  if (Platform.OS === "ios") {
    doHapticFeedback(getHapticFeedbackType());
  }

  if (Platform.OS === "android") {
    doHapticFeedback(getHapticFeedbackType());
  }
};

export const onGenericHapticFeedback = (): void => {
  const feedbackType = getHapticFeedbackType();

  if (!feedbackType) return;

  if (Platform.OS === "ios") {
    doHapticFeedback(getHapticFeedbackType());
  } else {
    doHapticFeedback("effectClick");
  }
};
