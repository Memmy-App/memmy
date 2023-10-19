import { useLoadData } from '@src/hooks';
import { GetCommunityResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import { useNavigation, useRoute } from '@react-navigation/core';
import { setNewPostId, useCommunityName, useNewPostId } from '@src/state';
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

  const newPostId = useNewPostId();

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

  useEffect(() => {
    if (newPostId == null) return;

    navigation.push('Post', { postId: newPostId });
    setNewPostId();
  }, [newPostId]);

  return {
    isLoading,
    isError,
  };
};
