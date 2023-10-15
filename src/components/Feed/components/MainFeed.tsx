import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import instance from '@src/Instance';
import VStack from '@components/Common/Stack/VStack';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useFeedNextPage, useFeedPostIds } from '@src/state/feed/feedStore';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { cleanupPosts } from '@helpers/state';
import IGetPostOptions from '@api/common/types/IGetPostOptions';
import CommunityHeader from '@components/Feed/components/Community/CommunityHeader';
import { FlashList } from '@shopify/flash-list';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { useScrollToTop } from '@react-navigation/native';
import { ListingType, SortType } from 'lemmy-js-client';
import {
  useDefaultCommunitySort,
  useDefaultListingType,
  useDefaultSort,
} from '@src/state/settings/settingsStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/SortTypeContextMenuButton';
import HStack from '@components/Common/Stack/HStack';
import ListingTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/ListingTypeContextMenuButton';

interface RenderItem {
  item: number;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { key, params } = useRoute<any>();

  const postIds = useFeedPostIds(key);
  const nextPage = useFeedNextPage(key);

  const defaultSort = useDefaultSort();
  const defaultCommunitySort = useDefaultCommunitySort();
  const defaultListingType = useDefaultListingType();

  const [sortType, setSortType] = useState<SortType>(
    params?.name != null ? defaultCommunitySort ?? 'Hot' : defaultSort ?? 'Hot',
  );
  const [listingType, setListingType] = useState<ListingType>(
    defaultListingType ?? 'All',
  );

  const flashListRef = useRef<FlashList<number>>();

  // @ts-expect-error - This is valid but useScrollToTop expect a ref to a FlatList
  useScrollToTop(flashListRef);

  // Define the default options for the requests
  const defaultOptions = useMemo(
    (): IGetPostOptions => ({
      communityName: (params?.name as unknown as string) ?? undefined,
      sort: sortType,
      ...(params?.name == null && { type: listingType }),
    }),
    [params?.name, sortType, listingType],
  );

  // Create our data loader and get the initial content
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

  // Cleanup posts whenever we leave the screen
  useEffect(() => {
    return () => {
      cleanupPosts(key);
    };
  }, []);

  // Update the sort type when it changes
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack space="$4">
          <ListingTypeContextMenuButton
            listingType={listingType}
            setListingType={setListingType}
          />
          <SortTypeContextMenuButton
            sortType={sortType}
            setSortType={setSortType}
          />
        </HStack>
      ),
    });

    // See if we are already loading and if not, we will refresh
    if (!isLoading) {
      onRefresh();
      flashListRef.current?.scrollToOffset({ offset: 0 });
    }
  }, [sortType, listingType]);

  // Callback for loading more data when we hit the end
  const onEndReached = useCallback(() => {
    append(async () => {
      await instance.getPosts(key, {
        ...defaultOptions,
        page: nextPage,
      });
    });
  }, [defaultOptions, nextPage]);

  // Callback for refreshing the data
  const onRefresh = useCallback(() => {
    console.log(defaultOptions);

    refresh(async () => {
      await instance.getPosts(key, {
        ...defaultOptions,
        page: 1,
        refresh: true,
      });
    });
  }, [defaultOptions]);

  return (
    <VStack flex={1}>
      <FlashList<number>
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
        // @ts-expect-error - This is valid but useScrollToTop expect a ref to a FlatList
        ref={flashListRef}
      />
    </VStack>
  );
}
