import {
  setDrawerOpen,
  useDefaultCommunitySort,
  useDefaultListingType,
  useDefaultSort,
  useFeedNextPage,
  useFeedPostIds,
  useLastHomePress,
} from '@src/state';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ListingType, SortType } from 'lemmy-js-client';
import { FlashList } from '@shopify/flash-list';
import { useScrollToTop } from '@react-navigation/native';
import IGetPostOptions from '@api/common/types/IGetPostOptions';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { cleanupPosts } from '@helpers/state';
import { useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ListingTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/ListingTypeContextMenuButton';
import SortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/SortTypeContextMenuButton';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { List } from '@tamagui/lucide-icons';
import { XStack } from 'tamagui';

interface UseMainFeed {
  postIds: number[];
  onEndReached: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  onRefresh: () => void;
  flashListRef: React.MutableRefObject<FlashList<number> | undefined>;

  sortType: SortType;
  listingType: ListingType;

  setSortType: React.Dispatch<React.SetStateAction<SortType>>;
  setListingType: React.Dispatch<React.SetStateAction<ListingType>>;
}

export const useMainFeed = (): UseMainFeed => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { key, params } = useRoute<any>();

  const postIds = useFeedPostIds(key);
  const nextPage = useFeedNextPage(key);

  const defaultSort = useDefaultSort();
  const defaultCommunitySort = useDefaultCommunitySort();
  const defaultListingType = useDefaultListingType();

  const lastHomePress = useLastHomePress();

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
      communityName: (params?.name as string) ?? undefined,
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

  // Add subs button if necessary and cleanup posts whenever we leave the screen
  useEffect(() => {
    navigation.setOptions({
      ...(params?.name == null
        ? {
            headerLeft: () => (
              <AnimatedIconButton
                icon={List}
                onPress={() => {
                  setDrawerOpen(true);
                }}
              />
            ),
          }
        : {
            headerShown: false,
          }),
    });

    return () => {
      cleanupPosts(key);
    };
  }, []);

  useEffect(() => {
    if (params?.name == null) {
      navigation.setOptions({
        headerRight: () => (
          <XStack space="$4">
            <ListingTypeContextMenuButton
              listingType={listingType}
              setListingType={setListingType}
            />
            <SortTypeContextMenuButton
              sortType={sortType}
              setSortType={setSortType}
            />
          </XStack>
        ),
      });
    }

    if (!isLoading) {
      onRefresh();
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [listingType, sortType]);

  useEffect(() => {
    if (lastHomePress === 0) return;

    if (!isLoading) {
      onRefresh();
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [lastHomePress]);

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
    refresh(async () => {
      await instance.getPosts(key, {
        ...defaultOptions,
        page: 1,
        refresh: true,
      });
    });
  }, [defaultOptions]);

  return {
    postIds,
    onEndReached,
    isLoading,
    isRefreshing,
    onRefresh,
    isError,
    flashListRef,

    sortType,
    listingType,

    setSortType,
    setListingType,
  };
};
