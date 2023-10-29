import { useDataStore } from '@src/state';
import { SubscribedType } from 'lemmy-js-client';

export const setSubscribed = (
  communityId: number,
  subscribed: SubscribedType,
): void => {
  useDataStore.setState((state) => {
    const community = state.communities.get(communityId);

    if (community == null) return;

    community.community_view.subscribed = subscribed;
  });
};
