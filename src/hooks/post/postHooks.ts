import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { CommentSortType, PostView } from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../slices/post/postSlice";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { setUpdateSaved, setUpdateVote } from "../../slices/feed/feedSlice";
import {
  onGenericHapticFeedback,
  onVoteHapticFeedback,
} from "../../helpers/HapticFeedbackHelpers";
import { ILemmyVote } from "../../types/lemmy/ILemmyVote";
import ILemmyComment from "../../types/lemmy/ILemmyComment";
import { showToast } from "../../slices/toast/toastSlice";
import {
  clearEditComment,
  selectEditComment,
} from "../../slices/comments/editCommentSlice";
import { savePost } from "../../helpers/LemmyHelpers";
import { buildComments } from "../../helpers/LemmyCommentsHelper";
import NestedComment from "../../types/lemmy/NestedComment";
import { selectSettings } from "../../slices/settings/settingsSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

export interface UsePost {
  comments: ILemmyComment[];
  visibleComments: ILemmyComment[];
  setComments: React.Dispatch<SetStateAction<ILemmyComment[]>>;
  commentsLoading: boolean;
  commentsError: boolean;
  doLoad: (ignoreCommentId?: boolean) => Promise<void>;

  currentPost: PostView;

  sortType: CommentSortType;
  setSortType: React.Dispatch<SetStateAction<CommentSortType>>;

  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;

  showLoadAll: boolean;
  setShowLoadAll: React.Dispatch<SetStateAction<boolean>>;

  doSave: () => Promise<void>;

  doVote: (value: -1 | 0 | 1) => Promise<void>;

  recycled: React.MutableRefObject<{}>;
}

const usePost = (commentId: string | null): UsePost => {
  // Global State
  const { post, newComment } = useAppSelector(selectPost);
  const { commentId: editedCommentId, content: editedContent } =
    useAppSelector(selectEditComment);
  const { defaultCommentSort } = useAppSelector(selectSettings);

  // State
  const [comments, setComments] = useState<ILemmyComment[]>([]);
  const [visibleComments, setVisibleComments] = useState<ILemmyComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  const [commentsError, setCommentsError] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<PostView>(post);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [sortType, setSortType] = useState<CommentSortType>(defaultCommentSort);

  const [showLoadAll, setShowLoadAll] = useState(true);

  const recycled = useRef({});

  // Other Hooks
  const dispatch = useAppDispatch();

  useEffect(() => {
    setVisibleComments(comments.filter((c) => !c.hidden));
  }, [comments]);

  useEffect(() => {
    doLoad(!showLoadAll).then();
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
   * Load the Comments for the current Post
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

      const getChildren = (comment: NestedComment) => {
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
        return replyComments;
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
      setCommentsLoading(false);
      setCommentsError(true);

      handleLemmyError(e.toString());
    }
  };

  /**
   * Vote on the current Post
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
      setCurrentPost({
        ...currentPost,
        my_vote: oldValue,
      });

      handleLemmyError(e.toString());
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
          message: "Failed to save Post.",
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
    visibleComments,
    setComments,

    commentsLoading,
    commentsError,
    doLoad,

    currentPost,

    sortType,
    setSortType,

    showLoadAll,
    setShowLoadAll,

    collapsed,
    setCollapsed,

    doSave,

    doVote,

    recycled,
  };
};

export default usePost;
