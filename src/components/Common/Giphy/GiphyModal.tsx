import React, { useCallback, useEffect, useState } from 'react';
import { INavigationProps } from '@src/types';
import { YStack } from 'tamagui';
import { IGiphySearchResult, useGiphySearch } from '@hooks/useGiphySearch';
import HeaderSearchBar from '@components/Common/HeaderSearchBar/HeaderSearchBar';
import GiphyImageButton from '@components/Common/Giphy/GiphyImageButton';
import { ListRenderItemInfo, MasonryFlashList } from '@shopify/flash-list';
import { Dimensions } from 'react-native';

const renderItem = ({
  item,
}: ListRenderItemInfo<IGiphySearchResult>): React.JSX.Element => {
  return <GiphyImageButton result={item} />;
};

const SCREEN_WIDTH = Dimensions.get('screen').width;

const keyExtractor = (item: IGiphySearchResult): string => item.url;
export default function GiphyModal({
  navigation,
}: INavigationProps): React.JSX.Element {
  const giphySearch = useGiphySearch();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (giphySearch.state.term === '') return;

    navigation.setOptions({
      headerTitle: `"${giphySearch.state.term}"`,
    });
  }, [giphySearch.state.term]);

  const onSubmit = useCallback(() => {
    void giphySearch.search(query);
  }, [query]);

  return (
    <YStack flex={1}>
      <MasonryFlashList
        data={giphySearch.state.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <HeaderSearchBar onChange={setQuery} onSearch={onSubmit} />
        }
        numColumns={2}
        estimatedItemSize={SCREEN_WIDTH / 2}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      />
    </YStack>
  );
}
