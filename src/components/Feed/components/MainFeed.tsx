import React from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '@api/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import { useFeedPostIds } from '@src/state/feed/feedStore';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';

const renderItem = ({ item }: ListRenderItemInfo<number>) => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number) => item.toString();

export default function MainFeed(): React.JSX.Element {
  // Get the feed ID
  const { key } = useRoute();
  const postIds = useFeedPostIds(key);

  const { isLoading } = useQuery(['feed', key], async () => {
    await instance.getPosts(key);
  });

  return (
    <VStack flex={1}>
      <FlashList
        renderItem={renderItem}
        data={postIds}
        keyExtractor={keyExtractor}
      />
    </VStack>
  );
}
