import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/core";
import { PostView } from "lemmy-js-client";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { determineVotes } from "../../helpers/VoteHelper";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { setPostSaved, setPostVote } from "../../stores/posts/actions";
import { useUpdatesStore } from "../../stores/updates/updatesStore";
import { setResponseTo } from "../../slices/comments/newCommentSlice";
import { shareLink } from "../../helpers/ShareHelper";
import { useCurrentPost } from "../../stores/posts/postsStore";
import { useAppDispatch } from "../../../store";

interface UsePostActionBar {
  currentPost: PostView;

  onCommentPress: () => void;
  onSharePress: () => void;
  onSavePress: () => void;
  onUpvotePress: () => void;
  onDownvotePress: () => void;
}

const usePostActionBar = (): UsePostActionBar => {
  const { postKey } = useRoute<any>().params;
  const currentPost = useCurrentPost(postKey);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const doVote = useCallback(
    (value: ILemmyVote) => {
      const newValues = determineVotes(
        value,
        currentPost.my_vote as ILemmyVote,
        currentPost.counts.upvotes,
        currentPost.counts.downvotes
      );

      // Play trigger
      onVoteHapticFeedback();

      setPostVote(postKey, currentPost.post.id, newValues).then();
      useUpdatesStore
        .getState()
        .setVoted(currentPost.post.id, newValues.newValue as ILemmyVote);
    },
    [currentPost.my_vote] // TODO FIX THIS
  );

  const onCommentPress = useCallback(() => {
    onGenericHapticFeedback();

    dispatch(
      setResponseTo({
        post: currentPost,
        languageId: currentPost.post.language_id,
      })
    );

    navigation.push("NewComment");
  }, [currentPost.post.id]);

  const onSavePress = useCallback(async () => {
    onGenericHapticFeedback();
    useUpdatesStore
      .getState()
      .setSaved(currentPost.post.id, !currentPost.saved);
    setPostSaved(postKey, currentPost.post.id, !currentPost.saved).then();
  }, [currentPost.post.id, currentPost.saved]);

  const onSharePress = useCallback(() => {
    onGenericHapticFeedback();

    shareLink({
      link: currentPost.post.ap_id,
      title: currentPost.post.name,
    }).then();
  }, [currentPost.post.id]);

  const onUpvotePress = useCallback(() => {
    doVote(1);
  }, [currentPost.post.id, currentPost.my_vote]);

  const onDownvotePress = useCallback(() => {
    doVote(-1);
  }, [currentPost.post.id, currentPost.my_vote]);

  return {
    currentPost,

    onCommentPress,
    onSharePress,
    onSavePress,
    onUpvotePress,
    onDownvotePress,
  };
};

export default usePostActionBar;
