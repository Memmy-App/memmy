import { useLoadData } from '@src/hooks';
import { GetCommunityResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useCommunityName } from '@src/state/community/communityStore';
import { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UseCommunityFeed {
  isLoading: boolean;
  isError: boolean;
}

export const useCommunityFeed = (): UseCommunityFeed => {
  const { params } = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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

  // Set the navigation options once we get the community info
  useEffect(() => {
    navigation.setOptions({
      title: communityTitle,
    });
  }, [communityTitle]);

  return {
    isLoading,
    isError,
  };
};
