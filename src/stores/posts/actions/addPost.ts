import { PostView } from "lemmy-js-client";
import { usePostsStore } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  usePostsStore.setState((state) => {
    state.posts.set(postKey, {
      post,
      postError: false,
      postLoading: false,
      collapsed: false,
    });
  });
};

export default addPost;
