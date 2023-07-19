import { usePostsStore } from "../postsStore";

const setPostCollapsed = (postKey: string) => {
  usePostsStore.setState((state) => {
    const prev = state.posts.get(postKey);
    prev.collapsed = !prev.collapsed;
  });
};

export default setPostCollapsed;
