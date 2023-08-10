import { useCallback } from "react";
import { onGenericHapticFeedback } from "@src/helpers/haptics/HapticFeedbackHelper";
import { useFeedPostRead, useFeedPostVote } from "@src/state/feed/feedStore";
import { useRoute } from "@react-navigation/core";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import setFeedRead from "@src/state/feed/actions/setFeedRead";
import { setFeedSaved } from "@src/state/feed/actions";

type UseOnFeedSave = () => void;

export const useOnFeedSave = (postId: number): UseOnFeedSave => {
  const { key } = useRoute();
  const postRead = useFeedPostRead(key, postId);
  const postVote = useFeedPostVote(key, postId);

  const markReadOnPostVote = useSettingsStore(
    (state) => state.markReadOnPostVote
  );

  return useCallback(() => {
    onGenericHapticFeedback();

    setFeedSaved(key, postId);

    if (!postRead && markReadOnPostVote) {
      setFeedRead(key, postId);
    }
  }, [postId, postRead, postVote, markReadOnPostVote]);
};
