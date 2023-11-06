import { PostPair, useDataStore } from '@src/state';

export const useFeedNextPage = (feedId: string): number =>
  useDataStore((state) => state.feeds.get(feedId)?.nextPage ?? 0);

export const useFeedPostPairs = (feedId: string): PostPair[] =>
  useDataStore((state) => state.feeds.get(feedId)?.postPairs ?? []);
