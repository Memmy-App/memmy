import usePostsStore from "../postsStore";

const removePost = (postKey: string) => {
  usePostsStore.setState((state) => {
    const { [postKey]: toRemove, ...rest } = state.posts;
    return rest;
  });
};

export default removePost;
