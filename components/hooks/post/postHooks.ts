import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CommentSortType, PostView } from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { setUpdateSaved, setUpdateVote } from "../../../slices/feed/feedSlice";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../../helpers/HapticFeedbackHelpers";
import { writeToLog } from "../../../helpers/LogHelper";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { showToast } from "../../../slices/toast/toastSlice";
import {
  clearEditComment,
  selectEditComment,
} from "../../../slices/comments/editCommentSlice";
import { savePost } from "../../../lemmy/LemmyHelpers";
import { buildComments } from "../../../lemmy/comments/LemmyCommentsHelper";
import NestedComment from "../../../lemmy/comments/NestedComment";

export interface UsePost {
  comments: ILemmyComment[];
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;
  commentsLoading: boolean;
  commentsError: boolean;
  doLoad: (ignoreCommentId?: boolean) => Promise<void>;

  currentPost: PostView;

  doSave: () => Promise<void>;

  doVote: (value: -1 | 0 | 1) => Promise<void>;

  recycled: React.MutableRefObject<{}>;
}

const usePost = (
  commentId: string | null,
  sortType: CommentSortType
): UsePost => {
  // Global State
  const { post, newComment } = useAppSelector(selectPost);
  const { commentId: editedCommentId, content: editedContent } =
    useAppSelector(selectEditComment);

  // State
  const [comments, setComments] = useState<ILemmyComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  const [commentsError, setCommentsError] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<PostView>(post);

  const recycled = useRef({});

  // Other Hooks
  const dispatch = useAppDispatch();

  // Check if a post is saved
  useEffect(() => {
    // Set the post to the one set in the store
    doLoad().then();

    return () => {
      recycled.current = null;
    };
  }, []);

  useEffect(() => {
    doLoad().then();
  }, [sortType]);

  useEffect(() => {
    if (newComment) {
      // Create a new comment chain
      const lComment: ILemmyComment = {
        comment: newComment.comment,
        collapsed: false,
        hidden: false,
        myVote: newComment.comment.my_vote as ILemmyVote,
      };
      // If it's a top comment, add it to top of current chain
      if (newComment.isTopComment) {
        setComments([lComment, ...comments]);
      } else {
        const pathArr = newComment.comment.comment.path.split(".");
        const searchId = Number(pathArr[pathArr.length - 2]);
        const index = comments.findIndex(
          (c) => c.comment.comment.id === searchId
        );

        setComments((prev) => [
          ...prev.slice(0, index + 1),
          lComment,
          ...prev.slice(index + 1),
        ]);
      }
    }
  }, [newComment]);

  useEffect(() => {
    if (editedCommentId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.comment.comment.id === editedCommentId) {
            return {
              ...c,
              comment: {
                ...c.comment,
                comment: {
                  ...c.comment.comment,
                  content: editedContent,
                },
              },
            };
          }
          return c;
        })
      );

      dispatch(clearEditComment());
    }
  }, [editedContent]);
  /**
   * Load the comments for the current post
   */
  const doLoad = async (ignoreCommentId = false) => {
    setCommentsLoading(true);
    setCommentsError(false);

    try {
      const commentsRes = await lemmyInstance.getComments({
        auth: lemmyAuthToken,
        post_id: currentPost.post.id,
        max_depth: 10,
        type_: "All",
        sort: sortType,
        parent_id:
          commentId && !ignoreCommentId ? Number(commentId) : undefined,
      });
      
      const ordered = buildComments(commentsRes.comments);

      const betterComments: ILemmyComment[] = [];

      function getChildren(comment: NestedComment) {
        const replyComments: ILemmyComment[] = [];
        for (const item of comment.replies) {
          replyComments.push({
            comment: item.comment,
            myVote: item.comment.my_vote as ILemmyVote,
            collapsed: false,
            hidden: false,
          });
          replyComments.push(...getChildren(item));
        }
        return [
          ...replyComments
        ]
      };

      for (const item of ordered) {
        betterComments.push({
          comment: item.comment,
          myVote: item.comment.my_vote as ILemmyVote,
          collapsed: false,
          hidden: false,
        });
        betterComments.push(...getChildren(item));
      }

      setComments(betterComments);
      setCommentsLoading(false);
    } catch (e) {
      writeToLog("Error loading post.");
      writeToLog(e.toString());

      setCommentsLoading(false);
      setCommentsError(true);
    }
  };

  /**
   * Vote on the current post
   * @param value
   */
  const doVote = async (value: -1 | 0 | 1) => {
    // If we already voted, this will be a neutral vote.
    if (value === currentPost.my_vote && value !== 0) value = 0;

    // Store old value incase we encounter an error
    const oldValue = currentPost.my_vote;

    // Play trigger
    onVoteHapticFeedback();

    // Update the state
    setCurrentPost({
      ...currentPost,
      my_vote: value,
    });

    // Put result in store so we can change it when we go back
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
      writeToLog("Error liking post.");
      writeToLog(e.toString());

      // If there was an error, reset the value and show a notification
      dispatch(
        showToast({
          message: "Error saving vote",
          duration: 3000,
          variant: "error",
        })
      );

      setCurrentPost({
        ...currentPost,
        my_vote: oldValue,
      });
    }
  };

  const doSave = async () => {
    onGenericHapticFeedback();

    setCurrentPost((prev) => ({
      ...prev,
      saved: !currentPost.saved,
    }));

    const res = await savePost(currentPost.post.id, !currentPost.saved);

    if (!res) {
      setCurrentPost((prev) => ({
        ...prev,
        saved: !currentPost.saved,
      }));

      dispatch(
        showToast({
          message: "Failed to save post.",
          variant: "error",
          duration: 2000,
        })
      );
    } else {
      dispatch(setUpdateSaved(post.post.id));
    }
  };

  return {
    comments,
    setComments,

    commentsLoading,
    commentsError,
    doLoad,

    currentPost,

    doSave,

    doVote,

    recycled,
  };
};

export default usePost;
