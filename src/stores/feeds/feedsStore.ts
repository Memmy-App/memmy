import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PostView, SortType } from "lemmy-js-client";

interface FeedsStore {
  feeds: Map<string, FeedState>;
}

interface FeedState {
  posts: PostView[];
  loading: boolean;
  error: boolean;
  refreshing: boolean;

  sortType: SortType;

  currentPage: number;
}

export const useFeedsStore = create(
  immer<FeedsStore>(() => ({
    feeds: new Map<string, FeedState>(),
  }))
);

export const useFeed = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey).posts);
export const useFeedStatus = (feedKey: string) =>
  useFeedsStore((state) => {
    const feed = state.feeds.get(feedKey);

    return {
      loading: feed.loading,
      error: feed.error,
      refreshing: feed.refreshing,
    };
  });

export const useFeedSort = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey).sortType);
