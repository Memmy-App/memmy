import { create } from "zustand";
import { PostView } from "lemmy-js-client";
import ILemmyComment from "../types/lemmy/ILemmyComment";

interface PostsState {
  posts: {
    [postKey: string]: PostState;
  };
  addPost: (postKey: string, post: PostView) => void;
  removePost: (postKey: string) => void;
}

interface PostState {
  post: PostView;
  postLoading: boolean;
  postError: boolean;

  comments: ILemmyComment[];
  commentsLoading: boolean;
  commentsError: boolean;
}

const usePostsStore = create<PostsState>()((set) => ({
  // All of our post states
  posts: {},

  // Add a post to the store
  addPost: (postKey: string, post: PostView) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [postKey]: {
          post,
          postError: false,
          postLoading: false,

          comments: [],
          commentsLoading: true,
          commentsError: false,
        },
      },
    })),

  // Use destructuring to remove a post from the store
  removePost: (postKey: string) =>
    set((state) => {
      const { [postKey]: toRemove, ...rest } = state.posts;
      return rest;
    }),
}));

export default usePostsStore;
