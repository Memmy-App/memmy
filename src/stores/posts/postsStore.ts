import { create } from "zustand";
import { CommentSortType, PostView } from "lemmy-js-client";
import ILemmyComment from "../../types/lemmy/ILemmyComment";

export interface PostsStore {
  posts: Map<string, PostState>;
}

export interface PostState {
  post: PostView;
  postLoading: boolean;
  postError: boolean;

  comments: ILemmyComment[];
  visibleComments: ILemmyComment[];

  commentsLoading: boolean;
  commentsError: boolean;

  collapsed: boolean;
  sortType: CommentSortType;
}

export const usePostsStore = create<PostsStore>()(() => ({
  posts: new Map<string, PostState>(),
}));

export const useCurrentPost = (postKey: string) =>
  usePostsStore((state) => state.posts.get(postKey));
