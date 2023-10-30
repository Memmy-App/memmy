import React, { useCallback, useMemo, useRef } from 'react';
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
  setPostRead,
  useMarkReadOnCommunityScroll,
  useMarkReadOnFeedScroll,
  useSettingsStore,
} from '@src/state';
import { ViewableItemsChanged } from '@src/types/ViewToken';
import CommunityInfo from '@components/Feed/components/Community/CommunityInfo';

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <CompactOrFull itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function MainFeed(): React.JSX.Element {
  const { params } = useRoute<any>();

  const markReadOnFeedScroll = useMarkReadOnFeedScroll();
  const markReadOnCommunityScroll = useMarkReadOnCommunityScroll();

  const theme = useTheme();

  const mainFeed = useMainFeed();
  const communityFeed = useCommunityFeed();

  const contentOffsetY = useSharedValue(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentOffsetY.value =
      e.nativeEvent.contentOffset.y > 0 ? e.nativeEvent.contentOffset.y : 0;
  }, []);

  const viewabilityConfig = useMemo(
    () => ({
      minimumViewTime: 1000,
      itemVisiblePercentThreshold: 50,
    }),
    [],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: ViewableItemsChanged<number>) => {
      const item = viewableItems?.[0]?.item;

      // If viewable items is null or empty, just return now
      if (item == null) return;

      /*
        This is a weird situation where we can't use the hook to get these setting values. FlashList does not support
        updating the viewability config on the fly and as a result we have to resort to this.
      */
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
          postId: item,
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
        <FlashList<number>
          renderItem={renderItem}
          data={mainFeed.postIds}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.5}
          onEndReached={mainFeed.onEndReached}
          estimatedItemSize={300}
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
          // @ts-expect-error - This is valid but it doesn't like the typing for some reason
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
      </View>
    </Animated.View>
  );
}
