import instance from "@src/Instance";
import { useFeedStore } from "@src/state/feed/feedStore";

const setFeedRead = (feedKey: string, postId: number): void => {
  useFeedStore.setState((state) => {
    const prev = state.feeds
      .get(feedKey)
      ?.posts.find((p) => p.post.id === postId);

    if (!prev) return;

    prev.read = !prev.read;
  });

  try {
    instance.markPostRead(postId).then();
  } catch (e) {
    /* Handled */
  }
};

export default setFeedRead;
