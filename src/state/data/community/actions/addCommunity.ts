import { GetCommunityResponse } from 'lemmy-js-client';
import { useCommunityStore } from '@src/state';

export const addCommunity = (communityResponse: GetCommunityResponse): void => {
  useCommunityStore.setState((state) => {
    state.communities.set(
      communityResponse.community_view.community.id,
      communityResponse,
    );
  });
};
