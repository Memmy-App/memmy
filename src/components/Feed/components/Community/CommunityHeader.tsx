import React, { useEffect } from 'react';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import CommunityIcon from '@components/Feed/components/Community/CommunityIcon';
import CommunityTitle from '@components/Feed/components/Community/CommunityTitle';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useLoadData } from '@hooks/useLoadData';
import { GetCommunityResponse } from 'lemmy-js-client';
import instance from '@src/Instance';
import {
  useCommunityBanner,
  useCommunityName,
  useCommunityNsfw,
} from '@src/state/community/communityStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CommunityActionBar from '@components/Feed/components/Community/CommunityActionBar';
import CommunityMetrics from '@components/Feed/components/Community/CommunityMetrics';
import { Image } from 'expo-image';

function CommunityHeader(): React.JSX.Element | null {
  const { params } = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  console.log(params);

  // Get the title
  const communityTitle = useCommunityName(params?.id);
  const communityBanner = useCommunityBanner(params?.id);
  const communityNsfw = useCommunityNsfw(params?.id);

  // Load the data
  const { isLoading, data } = useLoadData<
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

  // If we don't have the data and we don't have the ID, then we can't display anything
  if (params?.name == null || (!isLoading && data == null)) {
    return null;
  }

  // Return component
  return (
    <VStack backgroundColor="$fg" marginTop="$1">
      <VStack alignItems="center" position="absolute" width="100%" zIndex={-1}>
        <Image
          source={{ uri: communityBanner }}
          style={{ width: '100%', height: 137, opacity: 0.15 }}
          contentFit="cover"
          blurRadius={communityNsfw ? 90 : 3}
        />
      </VStack>
      <VStack padding="$3" space="$2" zIndex={1}>
        <HStack alignItems="center" space="$3">
          <CommunityIcon itemId={params.id ?? (data as number)} />
          <CommunityTitle itemId={params.id ?? (data as number)} />
        </HStack>
        <CommunityMetrics itemId={params.id ?? (data as number)} />
        <CommunityActionBar itemId={params.id ?? (data as number)} />
      </VStack>
    </VStack>
  );
}

export default React.memo(CommunityHeader);
