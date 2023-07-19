import { produce } from "immer";
import { PostsState, usePostsStore } from "../postsStore";

const setPostCollapsed = (postKey: string) => {
  usePostsStore.setState(
    produce((state: PostsState) => {
      state.posts[postKey].collapsed = !state.posts[postKey].collapsed;
    })
  );
};

export default setPostCollapsed;
