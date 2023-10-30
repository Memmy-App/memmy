import { GetCommunityResponse } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

interface AddCommunityParams {
  communityResponse: GetCommunityResponse;
}

export const addCommunity = ({
  communityResponse,
}: AddCommunityParams): void => {
  useDataStore.setState((state) => {
    state.communities.set(
      communityResponse.community_view.community.id,
      communityResponse,
    );
  });
};
