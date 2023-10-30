import { CommunityView } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

export const setSubscriptions = (subscriptions: CommunityView[]): void => {
  const sorted = subscriptions.sort((a, b) =>
    a.community.name > b.community.name
      ? 1
      : b.community.name > a.community.name
      ? -1
      : 0,
  );

  useDataStore.setState((state) => {
    state.site.subscriptions = sorted;
  });
};
