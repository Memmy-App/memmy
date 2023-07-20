import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { PostView, SortType } from "lemmy-js-client";

interface FeedsStore {
  feeds: Map<string, FeedState>;
}

interface FeedState {
  posts: PostView[];
  postsLoading: boolean;
  postsError: boolean;

  sortType: SortType;
}

export const useFeedsStore = create(
  immer<FeedsStore>(() => ({
    feeds: new Map<string, FeedState>(),
  }))
);

export const useFeed = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey).posts);
export const useFeedStatus = (feedKey: string) =>
  useFeedsStore((state) => ({
    loading: state.feeds.get(feedKey).postsLoading,
    error: state.feeds.get(feedKey).postsError,
  }));

export const useFeedSort = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey).sortType);
