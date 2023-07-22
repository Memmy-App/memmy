import { usePostsStore } from "../postsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const refreshPost = async (postKey) => {
  const currentState = usePostsStore.getState().posts.get(postKey);

  usePostsStore.setState((state) => {
    state.posts.get(postKey).status.refreshing = true;
  });

  try {
    const res = await lemmyInstance.getPost({
      auth: lemmyAuthToken,
      id: currentState.post.post.id,
    });

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey);
      prev.post = res.post_view;
      prev.status.refreshing = false;
    });
  } catch (e) {
    handleLemmyError(e.toString());

    usePostsStore.setState((state) => {
      state.posts.get(postKey).status.refreshing = false;
    });
  }
};

export default refreshPost;
