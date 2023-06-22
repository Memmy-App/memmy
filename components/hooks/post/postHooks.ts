import React, { useEffect, useRef, useState } from "react";
import {
  CommentSortType,
  CommentView,
  ListingType,
  PostView,
} from "lemmy-js-client";
import { useToast } from "native-base";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { setUpdateVote } from "../../../slices/feed/feedSlice";
import { selectBookmarks } from "../../../slices/bookmarks/bookmarksSlice";
import {
  addBookmark,
  removeBookmark,
} from "../../../slices/bookmarks/bookmarksActions";
import { onVoteHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import findAndAddComment from "../../../lemmy/LemmyCommentsHelper";
import { writeToLog } from "../../../helpers/LogHelper";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";

export interface UsePost {
  comments: NestedComment[];
  commentsLoading: boolean;
  commentsError: boolean;
  doLoad: () => Promise<void>;

  refreshList: boolean;

  currentPost: PostView;

  bookmarked: boolean;
  doBookmark: () => void;

  doVote: (value: -1 | 0 | 1) => Promise<void>;

  recycled: React.MutableRefObject<{}>;
}

const usePost = (): UsePost => {
  // Global State
  const { post, newComment } = useAppSelector(selectPost);
  const bookmarks = useAppSelector(selectBookmarks);

  // State
  const [comments, setComments] = useState<NestedComment[] | null>(null);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  const [commentsError, setCommentsError] = useState<boolean>(false);
  const [refreshList, setRefreshList] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostView>(post);
  const [bookmarked, setBookmarked] = useState<boolean>(
    bookmarks?.findIndex((b) => b.postId === currentPost.post.id) !== -1
  );
  const recycled = useRef({});

  // Other Hooks
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Check if a post is saved
  useEffect(() => {
    // Set the post to the one set in the store
    doLoad().then();

    return () => {
      recycled.current = null;
    };
  }, []);

  useEffect(() => {
    if (newComment) {
      // Create a new comment chain
      const lComment: NestedComment = {
        comment: newComment.comment,
        replies: [],
        collapsed: false,
        myVote: newComment.comment.my_vote as ILemmyVote,
      };
      // If it's a top comment, add it to top of current chain
      if (newComment.isTopComment) {
        setComments([lComment, ...comments]);
      } else {
        const newChain = findAndAddComment(comments, lComment);

        setComments(newChain);
        setRefreshList(!refreshList);
      }
    }
  }, [newComment]);

  /**
   * Load the comments for the current post
   */
  const doLoad = async () => {
    setCommentsLoading(true);
    setCommentsError(false);

    try {
      const commentsRes = await lemmyInstance.getComments({
        auth: lemmyAuthToken,
        post_id: currentPost.post.id,
        max_depth: 10,
        type_: "All",
        sort: "Top",
      });

      const ordered = commentsRes.comments.sort((a, b) =>
        a.comment.path.localeCompare(b.comment.path)
      );
      const parsed = buildComments(ordered);

      setComments(parsed);
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
      toast.show({
        title: "Error saving vote",
        duration: 3000,
      });

      setCurrentPost({
        ...currentPost,
        my_vote: oldValue,
      });
    }
  };

  /**
   * Bookmark the current post
   */
  const doBookmark = () => {
    if (bookmarked) {
      dispatch(removeBookmark(post.post.id));
      setBookmarked(false);
    } else {
      dispatch(
        addBookmark({
          postId: post.post.id,
          postName: post.post.name,
          postLink: post.post.ap_id,
        })
      );
      setBookmarked(true);
    }
  };

  return {
    comments,
    commentsLoading,
    commentsError,
    doLoad,

    refreshList,

    currentPost,

    bookmarked,
    doBookmark,

    doVote,

    recycled,
  };
};

export interface NestedComment {
  comment: CommentView;
  replies: NestedComment[];
  collapsed: boolean;
  myVote: ILemmyVote;
}

function buildComments(comments: CommentView[]): NestedComment[] {
  const nestedComments = [];

  const commentDict = {};

  for (const comment of comments) {
    const { path } = comment.comment;
    const pathIds = path.split(".").map(Number);
    const parentId = pathIds[pathIds.length - 2];

    const currentComment = {
      comment,
      replies: [],
    };

    commentDict[comment.comment.id] = currentComment;

    if (parentId !== 0) {
      const parentComment = commentDict[parentId];

      try {
        parentComment.replies.push(currentComment);
      } catch (e) {}
    } else {
      nestedComments.push(currentComment);
    }
  }

  return nestedComments;
}

export default usePost;
