import { usePostsStore } from "../postsStore";

const removePost = (postKey: string) => {
  usePostsStore.setState((state) => {
    state.posts.delete(postKey);
  });
};

export default removePost;
