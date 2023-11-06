import React, { useCallback, useRef } from 'react';
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
import { useTheme, View } from 'tamagui';
import CompactOrFull from '@components/Feed/components/Feed/CompactOrFull';
import {
  PostPair,
  setPostRead,
  useMarkReadOnCommunityScroll,
  useMarkReadOnFeedScroll,
  useSettingsStore,
  useViewType,
} from '@src/state';
import { ViewableItemsChanged } from '@src/types/ViewToken';
import CommunityInfo from '@components/Feed/components/Community/CommunityInfo';
import { LinkType } from '@src/types';

const viewabilityConfig = {
  minimumViewTime: 1000,
  itemVisiblePercentThreshold: 50,
};

const renderItem = ({
  item,
}: ListRenderItemInfo<PostPair>): React.JSX.Element => {
  return <CompactOrFull itemId={item.postId} />;
};

const getItemType = (item: PostPair): LinkType => {
  return item.linkType;
};

const keyExtractor = (item: PostPair): string => item.postId.toString();

export default function MainFeed(): React.JSX.Element {
  const { params } = useRoute<any>();

  const markReadOnFeedScroll = useMarkReadOnFeedScroll();
  const markReadOnCommunityScroll = useMarkReadOnCommunityScroll();
  const viewType = useViewType();

  const theme = useTheme();

  const mainFeed = useMainFeed();
  const communityFeed = useCommunityFeed();

  const contentOffsetY = useSharedValue(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentOffsetY.value =
      e.nativeEvent.contentOffset.y > 0 ? e.nativeEvent.contentOffset.y : 0;
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: ViewableItemsChanged<PostPair>) => {
      const item = viewableItems?.[0]?.item;

      // If viewable items is null or empty, just return now
      if (item == null) return;

      const markReadOnFeedScroll =
        useSettingsStore.getState().readOptions.onFeedScroll;
      const markReadOnCommunityScroll =
        useSettingsStore.getState().readOptions.onCommunityScroll;

      // If id is null, this is the main feed. See if we should mark read
      if (
        (params?.communityId == null && markReadOnFeedScroll) ||
        (params?.communityId != null && markReadOnCommunityScroll)
      ) {
        // Mark the first viewable post as read
        setPostRead({
          postId: item.postId,
        });
      }
    },
    [markReadOnFeedScroll, markReadOnCommunityScroll],
  );

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  if (params?.communityId != null && communityFeed.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      {(params?.communityId != null || params?.communityName != null) && (
        <CommunityHeader
          isLoading={mainFeed.isLoading}
          contentOffsetY={contentOffsetY}
          sortType={mainFeed.sortType}
          setSortType={mainFeed.setSortType}
        />
      )}
      <View flex={1} zIndex={-1}>
        <FlashList<PostPair>
          renderItem={renderItem}
          data={mainFeed.postPairs}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          onEndReachedThreshold={0.5}
          onEndReached={mainFeed.onEndReached}
          estimatedItemSize={viewType === 'compact' ? 100 : 350}
          scrollEventThrottle={16}
          onScroll={onScroll}
          ListHeaderComponent={
            params?.communityId != null ? <CommunityInfo /> : null
          }
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
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
      </View>
    </Animated.View>
  );
}
