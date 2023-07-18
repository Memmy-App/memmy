import { produce } from "immer";
import usePostsStore, { PostsState } from "../postsStore";

export const setPostCommentsLoading = async (
  postKey: string,
  value: boolean,
  error?: boolean
) => {
  usePostsStore.setState(
    produce((state: PostsState) => {
      state.posts[postKey].commentsLoading = true;
      state.posts[postKey].commentsError = value
        ? false
        : error !== undefined
        ? error
        : state.posts[postKey].commentsError;
    })
  );
};

export default setPostCommentsLoading;
