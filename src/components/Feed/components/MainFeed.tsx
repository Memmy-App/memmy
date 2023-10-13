import React, { useCallback } from 'react';
import instance from '@api/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import { useFeedNextPage, useFeedPostIds } from '@src/state/feed/feedStore';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { FlatList } from 'react-native';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';

interface RenderItem {
  item: number;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  // Get the feed ID
  const { key } = useRoute();
  const postIds = useFeedPostIds(key);
  const nextPage = useFeedNextPage(key);

  const { isLoading, isError, append } = useLoadData(async () => {
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
        ListFooterComponent={
          <FeedLoadingIndicator loading={isLoading} error={isError} />
        }
      />
    </VStack>
  );
}
