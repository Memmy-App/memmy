import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { CommentSortType, PostView } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { produce } from "immer";
import { Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { setUpdateSaved, setUpdateVote } from "../../slices/feed/feedSlice";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import ILemmyComment from "../../types/lemmy/ILemmyComment";
import { showToast } from "../../slices/toast/toastSlice";
import { savePost } from "../../helpers/LemmyHelpers";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import {
  PostsState,
  useCurrentPost,
  usePostsStore,
} from "../../stores/posts/postsStore";
import { loadPostComments, removePost } from "../../stores/posts/actions";

export interface UsePost {
  visibleComments: ILemmyComment[];

  currentPost: PostView;

  sortType: CommentSortType;
  setSortType: React.Dispatch<SetStateAction<CommentSortType>>;

  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;

  showLoadAll: boolean;
  setShowLoadAll: React.Dispatch<SetStateAction<boolean>>;

  doSave: () => Promise<void>;

  doVote: (value: -1 | 0 | 1) => Promise<void>;
}

const usePost = (commentId: string | null): UsePost => {
  // Get the things we need from the route
  const route = useRoute<any>();
  const { postKey } = route.params;

  const { defaultCommentSort } = useAppSelector(selectSettings);

  // Select the current post from the store
  const postState = useCurrentPost(postKey);
  const { post } = postState;

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [sortType, setSortType] = useState<CommentSortType>(defaultCommentSort);

  const [showLoadAll, setShowLoadAll] = useState(true);

  // Other Hooks
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    loadPostComments(postKey, { sortType }).then();

    // Remove the post when we are finished
    return () => {
      removePost(postKey);
    };
  }, []);

  useEffect(() => {
    usePostsStore.setState(
      produce((state: PostsState) => {
        state.posts[postKey].visibleComments = postState.visibleComments.filter(
          (c) => !c.hidden
        );
      })
    );
  }, [postState.comments]);

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

  /**
   * Vote on the current Post
   * @param value
   */
  const doVote = useCallback(
    async (value: -1 | 0 | 1) => {
      let { upvotes, downvotes } = post.counts;

      // If we already voted, this will be a neutral vote.
      if (value === post.my_vote && value !== 0) value = 0;

      // Store old value in case we encounter an error
      const oldValue = post.my_vote;

      // Deal with updating the upvote/downvote count
      if (value === 0) {
        if (oldValue === -1) downvotes -= 1;
        if (oldValue === 1) upvotes -= 1;
      }

      if (value === 1) {
        if (oldValue === -1) downvotes -= 1;
        upvotes += 1;
      }

      if (value === -1) {
        if (oldValue === 1) upvotes -= 1;
        downvotes += 1;
      }

      // Play trigger
      onVoteHapticFeedback();

      // Update the state
      // setCurrentPost({
      //   ...currentPost,
      //   my_vote: value,
      //   counts: {
      //     ...currentPost.counts,
      //     upvotes,
      //     downvotes,
      //     score: upvotes - downvotes,
      //   },
      // });

      // Put result in store, so we can change it when we go back
      dispatch(
        setUpdateVote({
          postId: post.post.id,
          vote: value,
        })
      );

      // Send request
      try {
        await lemmyInstance.likePost({
          auth: lemmyAuthToken,
          post_id: post.post.id,
          score: value,
        });
      } catch (e) {
        // setCurrentPost({
        //   ...currentPost,
        //   my_vote: oldValue,
        // });

        handleLemmyError(e.toString());
      }
    },
    [] // TODO FIX THIS
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
    sortType,
    setSortType,

    showLoadAll,
    setShowLoadAll,

    collapsed,
    setCollapsed,

    currentPost: post,

    doSave,

    doVote,
  };
};

export default usePost;
