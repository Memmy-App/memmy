import { useFeedStore } from "@src/state/feed/feedStore";

export const setFeedCommentsRead = (feedKey: string, postId: number): void => {
  useFeedStore.setState((state) => {
    const prev = state.feeds
      .get(feedKey)
      ?.posts.find((p) => p.post.id === postId);

    if (!prev) return;

    prev.unread_comments = 0;
  });
};
