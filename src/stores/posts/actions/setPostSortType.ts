import { CommentSortType } from "lemmy-js-client";
import { produce } from "immer";
import { PostsStore, usePostsStore } from "../postsStore";

const setPostSortType = (postKey: string, sortType: CommentSortType) => {
  usePostsStore.setState(
    produce((state: PostsStore) => {
      state.posts[postKey].sortType = sortType;
    })
  );
};

export default setPostSortType;
