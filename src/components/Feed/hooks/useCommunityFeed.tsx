import { useLoadData } from '@src/hooks';
import { GetCommunityResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import { useRoute } from '@react-navigation/core';
import { useCommunityName } from '@src/state/community/communityStore';

interface UseCommunityFeed {
  isLoading: boolean;
  isError: boolean;
}

export const useCommunityFeed = (): UseCommunityFeed => {
  const { params } = useRoute<any>();

  const communityTitle = useCommunityName(params?.id);

  // Load the data
  const { isLoading, isError } = useLoadData<
    GetCommunityResponse | number | undefined
  >(
    async () => {
      if (params?.id == null) return;
      return await instance.getCommunity(params?.name);
    },
    // We don't want to load the data again if we already have it
    () => {
      return communityTitle != null;
    },
  );

  return {
    isLoading,
    isError,
  };
};
