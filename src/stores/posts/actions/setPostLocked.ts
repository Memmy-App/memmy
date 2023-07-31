import { usePostsStore } from "@src/stores/posts/postsStore";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";

const setPostLocked = async (postKey: string, locked: boolean) => {
  const postId = usePostsStore.getState().posts.get(postKey).post.post.id;

  try {
    await lemmyInstance.lockPost({
      auth: lemmyAuthToken,
      post_id: postId,
      locked,
    });

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey).post.post;

      prev.locked = locked;
    });
  } catch (e) {
    handleLemmyError(e.toString());
  }
};

export default setPostLocked;
