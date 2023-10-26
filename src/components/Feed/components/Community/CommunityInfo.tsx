import React, { useCallback, useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { Star, StarOff, StickyNote } from '@tamagui/lucide-icons';
import {
  useCommunityActorId,
  useCommunityAggregates,
  useCommunityDescription,
  useCommunityName,
  useCommunitySubscribed,
} from '@src/state';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { getBaseUrl } from '@helpers/links';
import { isSubscribed } from '@helpers/lemmy';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

function CommunityInfo(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { params } = useRoute<any>();

  const communityCounts = useCommunityAggregates(params?.communityId);
  const communityDescription = useCommunityDescription(params?.communityId);
  const communityActorId = useCommunityActorId(params?.communityId);
  const communitySubscribed = useCommunitySubscribed(params?.communityId);
  const communityName = useCommunityName(params?.communityId);

  const subscribed = useMemo(
    () => isSubscribed(communitySubscribed),
    [communitySubscribed],
  );

  const { isLoading: isSubscribing, refresh: submit } = useLoadData();

  const onSubscribePress = useCallback(() => {
    submit(async () => {
      void instance.subscribeCommunity(params.id!, !subscribed).then(() => {});
    });
  }, [subscribed]);

  const communityInstance = useMemo(
    () => getBaseUrl(communityActorId),
    [communityActorId],
  );

  const onNewPostPress = useCallback(() => {
    navigation.push('NewPost', { communityId: params?.communityId });
  }, []);

  return (
    <YStack pb="$3">
      <XStack ml="auto" width="65%" py="$2" space="$3" right={10}>
        <ButtonOne
          label={subscribed ? 'Subscribed' : 'Subscribe'}
          icon={subscribed ? Star : StarOff}
          onPress={onSubscribePress}
          disabled={isSubscribing}
          backgroundColor="$fg"
        />
        <ButtonOne
          label="New Post"
          icon={StickyNote}
          onPress={onNewPostPress}
          backgroundColor="$fg"
        />
      </XStack>

      <YStack mx="$3" space="$2.5">
        <YStack alignItems="baseline" space="$0.5">
          <Text fontSize="$5" fontWeight="bold">
            {communityName}
          </Text>
          <Text fontSize="$3" color="$secondary">
            @{communityInstance}
          </Text>
        </YStack>
        <XStack space="$3">
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {communityCounts?.posts.toLocaleString()} Posts
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {communityCounts?.comments.toLocaleString()} Comments
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {communityCounts?.subscribers.toLocaleString()} Subscribers
          </Text>
        </XStack>
        <XStack>
          <Text fontSize="$3" color="$color" numberOfLines={2}>
            {communityDescription}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}

export default React.memo(CommunityInfo);
