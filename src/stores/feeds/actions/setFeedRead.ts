import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setFeedRead = (feedKey: string, postId: number) => {
  useFeedsStore.setState((state) => {
    state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).read =
      true;
  });

  try {
    lemmyInstance.markPostAsRead({
      auth: lemmyAuthToken,
      post_id: postId,
      read: true,
    });
  } catch (e) {
    handleLemmyError(e.toString());
  }
};

export default setFeedRead;
