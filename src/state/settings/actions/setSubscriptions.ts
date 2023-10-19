import { CommunityView } from 'lemmy-js-client';
import { useSiteStore } from '@src/state';

export const setSubscriptions = (subscriptions: CommunityView[]): void => {
  const sorted = subscriptions.sort((a, b) =>
    a.community.name > b.community.name
      ? 1
      : b.community.name > a.community.name
      ? -1
      : 0,
  );

  useSiteStore.setState((state) => {
    state.subscriptions = sorted;
  });
};
