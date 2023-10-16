import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import CommunityHeader from '@components/Feed/components/Community/CommunityHeader';
import { FlashList } from '@shopify/flash-list';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { useMainFeed } from '@components/Feed/hooks/useMainFeed';

interface RenderItem {
  item: number;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  const mainFeed = useMainFeed();

  return (
    <VStack flex={1}>
      <FlashList<number>
        renderItem={renderItem}
        data={mainFeed.postIds}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={mainFeed.onEndReached}
        estimatedItemSize={300}
        ListHeaderComponent={<CommunityHeader />}
        ListFooterComponent={
          <FeedLoadingIndicator
            loading={mainFeed.isLoading && !mainFeed.isRefreshing}
            error={mainFeed.isError}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={mainFeed.isRefreshing}
            onRefresh={mainFeed.onRefresh}
          />
        }
        // @ts-expect-error - This is valid but useScrollToTop expect a ref to a FlatList
        ref={mainFeed.flashListRef}
      />
    </VStack>
  );
}
