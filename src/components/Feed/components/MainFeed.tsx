import React, { useCallback } from 'react';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import CommunityHeader from '@components/Feed/components/Community/CommunityHeader';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { useMainFeed } from '@components/Feed/hooks/useMainFeed';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { useCommunityFeed } from '@components/Feed/hooks/useCommunityFeed';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { useTheme } from 'tamagui';

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <FeedItem itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  const { params } = useRoute<any>();

  const theme = useTheme();

  const mainFeed = useMainFeed();
  const communityFeed = useCommunityFeed();

  const contentOffsetY = useSharedValue(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentOffsetY.value =
      e.nativeEvent.contentOffset.y > 0 ? e.nativeEvent.contentOffset.y : 0;
  }, []);

  if (params?.id != null && communityFeed.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      {params?.id != null && (
        <CommunityHeader
          isLoading={mainFeed.isLoading}
          contentOffsetY={contentOffsetY}
        />
      )}
      <FlashList<number>
        renderItem={renderItem}
        data={mainFeed.postIds}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={mainFeed.onEndReached}
        estimatedItemSize={300}
        scrollEventThrottle={16}
        onScroll={onScroll}
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
        contentContainerStyle={{ backgroundColor: theme.bg.val }}
        // @ts-expect-error - This is valid but useScrollToTop expect a ref to a FlatList
        ref={mainFeed.flashListRef}
      />
    </Animated.View>
  );
}
