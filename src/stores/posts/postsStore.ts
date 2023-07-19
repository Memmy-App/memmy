import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PostView } from "lemmy-js-client";

export interface PostsStore {
  posts: Map<string, PostState>;
}

export interface PostState {
  post: PostView;
  postLoading: boolean;
  postError: boolean;

  collapsed: boolean;
}

export const usePostsStore = create(
  immer<PostsStore>(() => ({
    posts: new Map<string, PostState>(),
  }))
);

export const useCurrentPost = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey));
