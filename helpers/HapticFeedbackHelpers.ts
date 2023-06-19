import { trigger } from "react-native-haptic-feedback";
import { Platform } from "react-native";

export const onVoteHapticFeedback = () => {
  setTimeout(() => {
    trigger("soft");
  }, 25);

  trigger("effectHeavyClick");
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
    trigger("impactHeavy");
  }

  if (Platform.OS === "android") {
    trigger("effectHeavyClick");
  }
};
