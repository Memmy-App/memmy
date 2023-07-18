import { PostView } from "lemmy-js-client";
import { produce } from "immer";
import usePostsStore, { PostsState } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  usePostsStore.setState(
    produce((state: PostsState) => {
      state.posts[postKey] = {
        post,
        postError: false,
        postLoading: false,

        comments: [],
        commentsLoading: true,
        commentsError: false,
      };
    })
  );
};

export default addPost;
