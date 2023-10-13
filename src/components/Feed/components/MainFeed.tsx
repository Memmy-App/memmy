import React from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '@api/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import { useFeedPostIds } from '@src/state/feed/feedStore';
import { ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { FlatList } from 'react-native';

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  // Get the feed ID
  const { key } = useRoute();
  const postIds = useFeedPostIds(key);

  const { isLoading } = useQuery(['feed', key], async () => {
    await instance.getPosts(key);
  });

  return (
    <VStack flex={1}>
      <FlatList
        renderItem={renderItem}
        data={postIds}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        windowSize={5}
      />
    </VStack>
  );
}
