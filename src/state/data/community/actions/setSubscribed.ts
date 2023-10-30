import { useDataStore } from '@src/state';
import { SubscribedType } from 'lemmy-js-client';

interface SetSubscribedParams {
  communityId: number;
  subscribed: SubscribedType;
}

export const setSubscribed = ({
  communityId,
  subscribed,
}: SetSubscribedParams): void => {
  useDataStore.setState((state) => {
    const community = state.communities.get(communityId);

    if (community == null) return;

    community.community_view.subscribed = subscribed;
  });
};
