import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CommentSortType, PostView } from "lemmy-js-client";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

export interface PostsStore {
  posts: Map<string, PostState>;
}

export interface PostCommentsState {
  comments: ILemmyComment[];
  commentsLoading: boolean;
  commentsError: boolean;
  commentsSort: CommentSortType;
}

export interface PostState {
  post: PostView;
  postLoading: boolean;
  postError: boolean;

  collapsed: boolean;

  commentsState: PostCommentsState;
  rerenderComments: boolean;
}

// Create our store
export const usePostsStore = create(
  immer<PostsStore>(() => ({
    posts: new Map<string, PostState>(),
  }))
);

// Post state
export const useCurrentPost = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).post);
export const usePostTitle = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).post.post.name);
export const usePostCollapsed = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).collapsed);
export const usePostRerenderComments = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).rerenderComments);

// Comment state
export const useCurrentPostState = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey));
export const usePostComments = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).commentsState.comments);
export const usePostCommentsStatus = (postKey: string) =>
  usePostsStore((state) => ({
    commentsLoading: state.posts.get(postKey).commentsState.commentsLoading,
    commentsError: state.posts.get(postKey).commentsState.commentsError,
  }));
export const usePostCommentsSort = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey).commentsState.commentsSort);
export const usePostComment = (postKey: string, commentId: number) =>
  usePostsStore((state) =>
    state.posts
      .get(postKey)
      .commentsState.comments.find((c) => c.comment.comment.id === commentId)
  );

export const usePostCommentCollapsed = (postKey: string, commentId: number) =>
  usePostsStore(
    (state) =>
      state.posts
        .get(postKey)
        .commentsState.comments.find((c) => c.comment.comment.id === commentId)
        .collapsed
  );

export const usePostCommentHidden = (postKey: string, commentId: number) =>
  usePostsStore(
    (state) =>
      state.posts
        .get(postKey)
        .commentsState.comments.find((c) => c.comment.comment.id === commentId)
        .hidden
  );
