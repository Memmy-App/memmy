import { PostView } from "lemmy-js-client";
import { usePostsStore } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  usePostsStore.setState((state) => {
    state.posts.set(postKey, {
      post,
      postError: false,
      postLoading: false,
      collapsed: false,
      rerenderComments: false,

      commentsState: {
        commentsLoading: true,
        commentsError: false,
        comments: [],
        commentsSort: "Top", // TODO Use default
      },
    });
  });
};

export default addPost;
