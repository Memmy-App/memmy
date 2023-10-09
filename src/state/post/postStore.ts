import { CommentView, PostView } from "lemmy-js-client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface PostState {
  view: PostView;
  comments: CommentView[];
  usedBy: string[];
}

export interface PostStore {
  posts: Map<number, PostState>;
}

export const usePostStore = create(
  immer<PostStore>(() => ({
    posts: new Map<number, PostState>(),
  })),
);

export const usePostView = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.view;

export const usePostComments = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.comments;

export const usePost = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.view.post;

export const usePostVotes = (id: number) =>
  usePostStore((state) => {
    const post = state.posts.get(id);

    return {
      upvotes: post?.view.counts.upvotes,
      downvotes: post?.view.counts.downvotes,
      score: post?.view.counts.score,
    };
  });

export const usePostRead = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.view.read;

export const usePostCreator = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.view.creator;

export const usePostCommentCount = (id: number) =>
  usePostStore((state) => state.posts.get(id))?.view.counts.comments;
