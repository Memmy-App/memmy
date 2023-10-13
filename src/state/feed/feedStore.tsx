import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface FeedState {
  feedId: string;
  communityName?: string;
  postIds: number[];
  nextPage: number;
}

interface FeedStore {
  feeds: Map<string, FeedState>;
}

export const useFeedStore = create(
  immer<FeedStore>(() => ({
    feeds: new Map<string, FeedState>(),
  })),
);

export const useFeed = (feedId: string): FeedState | undefined =>
  useFeedStore((state) => state.feeds.get(feedId));

export const useFeedNextPage = (feedId: string): number =>
  useFeedStore((state) => state.feeds.get(feedId)?.nextPage ?? 0);

export const useFeedPostIds = (feedId: string): number[] =>
  useFeedStore((state) => state.feeds.get(feedId)?.postIds ?? []);
