import { useDataStore } from '@src/state';

export const useFeedNextPage = (feedId: string): number =>
  useDataStore((state) => state.feeds.get(feedId)?.nextPage ?? 0);

export const useFeedPostIds = (feedId: string): number[] =>
  useDataStore((state) => state.feeds.get(feedId)?.postIds ?? []);
