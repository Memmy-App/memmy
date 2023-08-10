import ILemmyVote from "@src/types/api/ILemmyVote";
import { useCallback } from "react";
import { onVoteHapticFeedback } from "@src/helpers/haptics/HapticFeedbackHelper";
import { determineVotes } from "@src/helpers/voting";
import {
  useFeedPostCounts,
  useFeedPostRead,
  useFeedPostVote,
} from "@src/state/feed/feedStore";
import { useRoute } from "@react-navigation/core";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import { setFeedVote } from "@src/state/feed/actions";
import { setFeedRead } from "@src/state/feed/actions/setFeedRead";

type UseOnFeedVote = (value: ILemmyVote, haptic: boolean) => void;

export const useFeedVote = (postId: number): UseOnFeedVote => {
  const { key } = useRoute();
  const postRead = useFeedPostRead(key, postId);
  const postVote = useFeedPostVote(key, postId);
  const postCounts = useFeedPostCounts(key, postId);

  const markReadOnPostVote = useSettingsStore(
    (state) => state.markReadOnPostVote
  );

  return useCallback(
    (value: ILemmyVote, haptic = true) => {
      if (haptic) onVoteHapticFeedback();

      const newValues = determineVotes(
        value,
        postVote as ILemmyVote,
        postCounts?.upvotes ?? 0,
        postCounts?.downvotes ?? 0
      );

      setFeedVote(key, postId, newValues).then();

      if (!postRead && markReadOnPostVote) {
        setFeedRead(key, postId);
      }
    },
    [postId, postRead, postVote, markReadOnPostVote]
  );
};
