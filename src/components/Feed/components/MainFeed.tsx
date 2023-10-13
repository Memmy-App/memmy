import React, { useCallback } from 'react';
import instance from '@api/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import { useFeedNextPage, useFeedPostIds } from '@src/state/feed/feedStore';
import { ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { FlatList } from 'react-native';
import { useLoadData } from '@hooks/useLoadData';

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
  const nextPage = useFeedNextPage(key);

  const { isLoading, append } = useLoadData(async () => {
    await instance.getPosts(key, {}, true);
  });

  const onEndReached = useCallback(() => {
    append(async () => {
      await instance.getPosts(key, {
        page: nextPage,
      });
    });
  }, [nextPage]);

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
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
      />
    </VStack>
  );
}
