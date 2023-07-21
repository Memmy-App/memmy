import { usePostsStore } from "../postsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setPostSaved = async (
  postKey: string,
  postId: number,
  saved: boolean
) => {
  usePostsStore.setState((state) => {
    state.posts.get(postKey).post.saved = saved;
  });

  try {
    await lemmyInstance.savePost({
      auth: lemmyAuthToken,
      post_id: postId,
      save: saved,
    });
  } catch (e) {
    usePostsStore.setState((state) => {
      state.posts.get(postKey).post.saved = saved;
    });

    handleLemmyError(e.toString());
  }
};

export default setPostSaved;
