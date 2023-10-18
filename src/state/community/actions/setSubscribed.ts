import { useCommunityStore } from '@src/state/community/communityStore';
import { SubscribedType } from 'lemmy-js-client';

export const setSubscribed = (
  communityId: number,
  subscribed: SubscribedType,
): void => {
  useCommunityStore.setState((state) => {
    const community = state.communities.get(communityId);

    if (community == null) return;

    community.community_view.subscribed = subscribed;
  });
};
