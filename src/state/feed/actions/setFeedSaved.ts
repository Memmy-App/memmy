import { useFeedStore } from "@src/state/feed/feedStore";
import instance from "@src/Instance";

export const setFeedSaved = (feedKey: string, postId: number): void => {
  const current = useFeedStore
    .getState()
    .feeds.get(feedKey)
    ?.posts.find((p) => p.post.id === postId);

  useFeedStore.setState((state) => {
    const prev = state.feeds
      .get(feedKey)
      ?.posts.find((p) => p.post.id === postId);

    if (!prev) return;

    prev.saved = !prev.saved;
  });

  try {
    if (!current) return;

    instance.savePost(postId, !current.saved).then();
  } catch (e) {
    /* Handled */
  }
};
