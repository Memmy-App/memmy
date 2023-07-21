import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ListingType, PostView, SortType } from "lemmy-js-client";

interface FeedsStore {
  feeds: Map<string, FeedState>;
}

interface FeedState {
  posts: PostView[];

  communityName?: string | undefined;

  status: {
    loading: boolean;
    error: boolean;
    refreshing: boolean;
    refresh: boolean;
  };

  sortType: SortType;
  listingType?: ListingType;

  currentPage: number;
}

export const useFeedsStore = create(
  immer<FeedsStore>(() => ({
    feeds: new Map<string, FeedState>(),
  }))
);

export const useFeedPosts = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.posts);
export const useFeedPost = (feedKey: string, postId: number) =>
  useFeedsStore((state) =>
    state.feeds.get(feedKey).posts.find((p) => p.post.id === postId)
  );

export const useFeedStatus = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.status);

export const useFeedSort = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.sortType);
export const useFeedListingType = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.listingType);

export const useFeedCommunityName = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.communityName);
