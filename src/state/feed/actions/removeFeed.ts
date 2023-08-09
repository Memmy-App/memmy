import { useFeedStore } from "@src/state/feed/feedStore";

export const removeFeed = (feedKey: string): void => {
  useFeedStore.setState((state) => {
    state.feeds.delete(feedKey);
  });
};
