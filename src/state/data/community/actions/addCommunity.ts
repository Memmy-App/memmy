import { GetCommunityResponse } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

export const addCommunity = (communityResponse: GetCommunityResponse): void => {
  useDataStore.setState((state) => {
    state.communities.set(
      communityResponse.community_view.community.id,
      communityResponse,
    );
  });
};
