import { useFeedsStore } from "../feedsStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setFeedRead = (feedKey: string, postId: number) => {
  useFeedsStore.setState((state) => {
    const prev = state.feeds
      .get(feedKey)
      .posts.find((p) => p.post.id === postId);
    prev.read = true;
    prev.unread_comments = 0;
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
