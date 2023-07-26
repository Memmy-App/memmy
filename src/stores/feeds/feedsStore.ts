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

export const useFeedPostVote = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).my_vote
  );

export const useFeedPostCounts = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).counts
  );

export const useFeedPostInfo = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).post
  );

export const useFeedPostSaved = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).saved
  );

export const useFeedPostRead = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).read
  );

export const useFeedPostCommunity = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).community
  );

export const useFeedPostCreator = (feedKey: string, postId: number) =>
  useFeedsStore(
    (state) =>
      state.feeds.get(feedKey).posts.find((p) => p.post.id === postId).creator
  );

export const useFeedStatus = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.status);

export const useFeedSort = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.sortType);
export const useFeedListingType = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.listingType);

export const useFeedCommunityName = (feedKey: string) =>
  useFeedsStore((state) => state.feeds.get(feedKey)?.communityName);
