import { produce } from "immer";
import { PostsStore, usePostsStore } from "../postsStore";

const setPostCollapsed = (postKey: string) => {
  usePostsStore.setState(
    produce((state: PostsStore) => {
      state.posts[postKey].collapsed = !state.posts[postKey].collapsed;
    })
  );
};

export default setPostCollapsed;
