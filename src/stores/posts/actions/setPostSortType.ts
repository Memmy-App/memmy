import { CommentSortType } from "lemmy-js-client";
import { produce } from "immer";
import { PostsState, usePostsStore } from "../postsStore";

const setPostSortType = (postKey: string, sortType: CommentSortType) => {
  usePostsStore.setState(
    produce((state: PostsState) => {
      state.posts[postKey].sortType = sortType;
    })
  );
};

export default setPostSortType;
