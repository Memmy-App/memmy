import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setFeedSaved = async (
  feedKey: string,
  postId: number,
  saved: boolean
) => {
  useFeedsStore.setState((state) => {
    const prev = state.feeds
      .get(feedKey)
      .posts.find((p) => p.post.id === postId);

    prev.saved = saved;
  });

  try {
    await lemmyInstance.savePost({
      auth: lemmyAuthToken,
      post_id: postId,
      save: saved,
    });
  } catch (e) {
    useFeedsStore.setState((state) => {
      const prev = state.feeds
        .get(feedKey)
        .posts.find((p) => p.post.id === postId);

      prev.saved = !saved;
    });

    handleLemmyError(e);
  }
};

export default setFeedSaved;
