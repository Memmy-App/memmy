import { useCallback } from "react";
import { PostView } from "lemmy-js-client";
import { useRoute } from "@react-navigation/core";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { PostState, useCurrentPost } from "../../stores/posts/postsStore";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { determineVotes } from "../../helpers/VoteHelper";
import {
  loadPostComments,
  setPostCollapsed,
  setPostSaved,
  setPostVote,
} from "../../stores/posts/actions";
import { useUpdatesStore } from "../../stores/updates/updatesStore";

export interface UsePost {
  postKey: string;
  postState: PostState;
  post: PostView;

  currentPost: PostView;

  doLoad: () => void;
  doSave: () => Promise<void>;
  doVote: (value: -1 | 0 | 1) => void;
  onPostPress: () => void;
}

const usePost = (): UsePost => {
  // Get the things we need from the route
  const route = useRoute<any>();
  const { postKey } = route.params;

  // Select the current post from the store
  const postState = useCurrentPost(postKey);
  const { post } = postState;

  const updatesStore = useUpdatesStore();

  // useEffect(() => {
  //   if (newComment) {
  //     // Create a new comment chain
  //     const lComment: ILemmyComment = {
  //       comment: newComment.comment,
  //       collapsed: false,
  //       hidden: false,
  //       myVote: newComment.comment.my_vote as ILemmyVote,
  //     };
  //     // If it's a top comment, add it to top of current chain
  //     if (newComment.isTopComment) {
  //       setComments([lComment, ...comments]);
  //     } else {
  //       const pathArr = newComment.comment.comment.path.split(".");
  //       const searchId = Number(pathArr[pathArr.length - 2]);
  //       const index = comments.findIndex(
  //         (c) => c.comment.comment.id === searchId
  //       );
  //
  //       setComments((prev) => [
  //         ...prev.slice(0, index + 1),
  //         lComment,
  //         ...prev.slice(index + 1),
  //       ]);
  //     }
  //   }
  // }, [newComment]);
  //
  // useEffect(() => {
  //   if (editedCommentId) {
  //     setComments((prev) =>
  //       prev.map((c) => {
  //         if (c.comment.comment.id === editedCommentId) {
  //           return {
  //             ...c,
  //             comment: {
  //               ...c.comment,
  //               comment: {
  //                 ...c.comment.comment,
  //                 content: editedContent,
  //               },
  //             },
  //           };
  //         }
  //         return c;
  //       })
  //     );
  //
  //     dispatch(clearEditComment());
  //   }
  // }, [editedContent]);
  /**
   * Load the Comments for the current Post
   */
  const doLoad = () => {
    loadPostComments(postKey, {
      sortType: postState.sortType,
    }).then();
  };

  /**
   * Vote on the current Post
   * @param value
   */
  const doVote = useCallback(
    (value: ILemmyVote) => {
      const newValues = determineVotes(
        value,
        post.my_vote,
        post.counts.upvotes,
        post.counts.downvotes
      );

      // Play trigger
      onVoteHapticFeedback();

      setPostVote(postKey, post.post.id, newValues).then();
      updatesStore.setVoted(post.post.id, newValues.newValue as ILemmyVote);
    },
    [post.my_vote] // TODO FIX THIS
  );

  const doSave = useCallback(async () => {
    onGenericHapticFeedback();
    useUpdatesStore.getState().setSaved(post.post.id, !post.saved);
    setPostSaved(postKey, post.post.id, !post.saved).then();
  }, [post.post.id, post.saved]);

  const onPostPress = useCallback(() => {
    setPostCollapsed(postKey);
  }, [post.post.id]);

  return {
    postKey,
    postState,
    post,

    currentPost: post,

    doLoad,
    doSave,
    doVote,

    onPostPress,
  };
};

export default usePost;
