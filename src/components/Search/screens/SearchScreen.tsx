import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import HeaderSearchBar from '@components/Common/HeaderSearchBar/HeaderSearchBar';
import { useLoadData } from '@hooks/useLoadData';
import instance from '@src/Instance';
import { CommunityView } from 'lemmy-js-client';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useFocusEffect } from '@react-navigation/core';
import CommunitySearchResult from '@components/Search/components/CommunitySearchResult';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<CommunityView>): React.JSX.Element => {
  return <CommunitySearchResult view={item} />;
};

const keysExtractor = (item: CommunityView): string => {
  return item.community.id.toString();
};

export default function SearchScreen({
  navigation,
}: IProps): React.JSX.Element {
  const [searchValue, setSearchValue] = useState('');
  const [trendingNextPage, setTrendingNextPage] = useState(1);

  const {
    isLoading: trendingLoading,
    isError: trendingError,
    refresh: trendingRefresh,
    append: trendingAppend,
    data: trendingData,
  } = useLoadData<CommunityView[] | undefined>(
    async () => {
      return (await instance.listCommunities())?.communities;
    },
    undefined,
    setTrendingNextPage,
  );

  const onSearchTextChange = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  const onSearch = useCallback(() => {
    navigation.navigate('SearchResults', {
      searchValue,
    });
  }, [searchValue]);

  const onClear = useCallback(() => {
    setSearchValue('');
  }, []);

  // const searchDebounce = useMemo(() => {
  //   return debounce(onSearchTextChange, 300);
  // }, []);

  const onTrendingEndReached = useCallback(() => {
    trendingAppend(async () => {
      return (
        await instance.listCommunities({
          page: trendingNextPage,
        })
      )?.communities;
    });
  }, [trendingNextPage]);

  useEffect(() => {}, [searchValue]);

  useFocusEffect(
    useCallback(() => {
      trendingRefresh();
    }, []),
  );

  return (
    <FlashList<CommunityView>
      contentInsetAdjustmentBehavior="automatic"
      data={trendingData}
      renderItem={renderItem}
      keyExtractor={keysExtractor}
      estimatedItemSize={135}
      onEndReached={onTrendingEndReached}
      onEndReachedThreshold={1}
      ListHeaderComponent={
        <HeaderSearchBar
          onChange={onSearchTextChange}
          onSearch={onSearch}
          onClear={onClear}
        />
      }
      ListFooterComponent={
        <FeedLoadingIndicator loading={trendingLoading} error={trendingError} />
      }
      keyboardDismissMode="on-drag"
    />
  );
}
