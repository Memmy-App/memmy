import {
  Community,
  ListingType,
  Person,
  Post,
  PostAggregates,
  PostView,
  SortType,
} from "lemmy-js-client";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";

interface FeedStore {
  feeds: Map<string, FeedState>;
}

interface FeedState {
  posts: PostView[];

  communityName?: string | undefined;

  status: FeedStatus;

  sortType: SortType;
  listingType?: ListingType;

  currentPage: number;
}

interface FeedStatus {
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  refresh: boolean;
}

export const useFeedStore = create(
  immer<FeedStore>(() => ({
    feeds: new Map<string, FeedState>(),
  }))
);

export const useFeedPosts = (feedKey: string): PostView[] | undefined =>
  useFeedStore((state) => state.feeds.get(feedKey)?.posts);
export const useFeedPost = (
  feedKey: string,
  postId: number
): PostView | undefined =>
  useFeedStore((state) =>
    state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)
  );

export const useFeedPostVote = (
  feedKey: string,
  postId: number
): number | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.my_vote
  );

export const useFeedPostCounts = (
  feedKey: string,
  postId: number
): PostAggregates | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.counts
  );

export const useFeedPostInfo = (
  feedKey: string,
  postId: number
): Post | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.post
  );

export const useFeedPostSaved = (
  feedKey: string,
  postId: number
): boolean | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.saved
  );

export const useFeedPostRead = (
  feedKey: string,
  postId: number
): boolean | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.read
  );

export const useFeedPostUnreadComments = (
  feedKey: string,
  postId: number
): number | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)
        ?.unread_comments
  );

export const useFeedPostCommunity = (
  feedKey: string,
  postId: number
): Community | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)
        ?.community
  );

export const useFeedPostCreator = (
  feedKey: string,
  postId: number
): Person | undefined =>
  useFeedStore(
    (state) =>
      state.feeds.get(feedKey)?.posts.find((p) => p.post.id === postId)?.creator
  );

export const useFeedStatus = (feedKey: string): FeedStatus | undefined =>
  useFeedStore((state) => state.feeds.get(feedKey)?.status);

export const useFeedSort = (feedKey: string): SortType | undefined =>
  useFeedStore((state) => state.feeds.get(feedKey)?.sortType);
export const useFeedListingType = (feedKey: string): ListingType | undefined =>
  useFeedStore((state) => state.feeds.get(feedKey)?.listingType);

export const useFeedCommunityName = (feedKey: string): string | undefined =>
  useFeedStore((state) => state.feeds.get(feedKey)?.communityName);
