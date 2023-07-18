import { useCallback } from "react";
import { PostView } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch } from "../../../store";
import { setUpdateSaved, setUpdateVote } from "../../slices/feed/feedSlice";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { showToast } from "../../slices/toast/toastSlice";
import { savePost } from "../../helpers/LemmyHelpers";
import { PostState, useCurrentPost } from "../../stores/posts/postsStore";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import { determineVotes } from "../../helpers/VoteHelper";
import { setPostVote } from "../../stores/posts/actions";

export interface UsePost {
  postKey: string;
  postState: PostState;
  post: PostView;

  currentPost: PostView;

  doLoad: () => void;
  doSave: () => Promise<void>;
  doVote: (value: -1 | 0 | 1) => void;
}

const usePost = (): UsePost => {
  // Get the things we need from the route
  const route = useRoute<any>();
  const { postKey } = route.params;

  // Select the current post from the store
  const postState = useCurrentPost(postKey);
  const { post } = postState;

  // Other Hooks
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
  const doLoad = () => {};

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

      // Put result in store, so we can change it when we go back
      dispatch(
        setUpdateVote({
          postId: post.post.id,
          vote: value,
        })
      );

      setPostVote(postKey, post.post.id, newValues).then();
    },
    [post.my_vote] // TODO FIX THIS
  );

  const doSave = useCallback(async () => {
    onGenericHapticFeedback();

    // setCurrentPost((prev) => ({
    //   ...prev,
    //   saved: !currentPost.saved,
    // }));

    const res = await savePost(post.post.id, !post.saved);

    if (!res) {
      // setCurrentPost((prev) => ({
      //   ...prev,
      //   saved: !currentPost.saved,
      // }));

      dispatch(
        showToast({
          message: t("Toast.failedToSavePost"),
          variant: "error",
          duration: 2000,
        })
      );
    } else {
      dispatch(setUpdateSaved(post.post.id));
    }
  }, []); // TODO FIX THIS

  return {
    postKey,
    postState,
    post,

    currentPost: post,

    doLoad,
    doSave,
    doVote,
  };
};

export default usePost;
