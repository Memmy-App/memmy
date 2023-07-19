import { PostView } from "lemmy-js-client";
import { produce } from "immer";
import { PostsStore, usePostsStore } from "../postsStore";

const addPost = (postKey: string, post: PostView) => {
  usePostsStore.setState(
    produce((state: PostsStore) => {
      state.posts[postKey] = {
        post,
        postError: false,
        postLoading: false,

        comments: [],
        visibleComments: [],

        commentsLoading: true,
        commentsError: false,

        collapsed: false,

        // TODO use default
        sortType: "Top",
      };
    })
  );
};

export default addPost;
