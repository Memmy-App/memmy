import React, { useCallback, useEffect, useMemo } from 'react';
import instance from '@api/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import { useFeedNextPage, useFeedPostIds } from '@src/state/feed/feedStore';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { cleanupPosts } from '@helpers/state';
import IGetPostOptions from '@api/common/types/IGetPostOptions';
import CommunityHeader from '@components/Feed/components/Community/CommunityHeader';
import { FlashList } from '@shopify/flash-list';
import RefreshControl from '@components/Common/Gui/RefreshControl';

interface RenderItem {
  item: number;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  // Get the feed ID
  const { key, params } = useRoute<any>();
  const postIds = useFeedPostIds(key);
  const nextPage = useFeedNextPage(key);

  useEffect(() => {
    return () => {
      cleanupPosts(key);
    };
  }, []);

  const defaultOptions = useMemo(
    (): IGetPostOptions => ({
      communityName: (params?.name as unknown as string) ?? undefined,
    }),
    [params?.name],
  );

  const { isLoading, isRefreshing, isError, append, refresh } = useLoadData(
    async () => {
      await instance.getPosts(
        key,
        {
          ...defaultOptions,
        },
        true,
      );
    },
  );

  const onEndReached = useCallback(() => {
    append(async () => {
      await instance.getPosts(key, {
        ...defaultOptions,
        page: nextPage,
      });
    });
  }, [nextPage]);

  const onRefresh = useCallback(() => {
    refresh(async () => {
      await instance.getPosts(key, {
        ...defaultOptions,
        page: 1,
        refresh: true,
      });
    });
  }, []);

  return (
    <VStack flex={1}>
      <FlashList
        renderItem={renderItem}
        data={postIds}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        estimatedItemSize={300}
        ListHeaderComponent={<CommunityHeader />}
        ListFooterComponent={
          <FeedLoadingIndicator
            loading={isLoading && !isRefreshing}
            error={isError}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </VStack>
  );
}
