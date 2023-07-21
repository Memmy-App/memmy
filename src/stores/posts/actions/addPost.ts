import { PostView } from "lemmy-js-client";
import { usePostsStore } from "../postsStore";
import store from "../../../../store";

const addPost = (postKey: string, post: PostView) => {
  const { defaultCommentSort } = store.getState().settings;

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
        commentsSort: defaultCommentSort,
      },
    });
  });
};

export default addPost;
