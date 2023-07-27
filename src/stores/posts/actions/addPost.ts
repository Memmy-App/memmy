import { PostView } from "lemmy-js-client";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { usePostsStore } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  const { defaultCommentSort } = useSettingsStore.getState().settings;

  usePostsStore.setState((state) => {
    state.posts.set(postKey, {
      post,

      status: {
        loading: false,
        error: false,
        refreshing: false,
      },

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
