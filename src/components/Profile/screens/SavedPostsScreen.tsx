import React from 'react';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { useSavedPostsTab } from '@components/Profile/hooks/useSavedPostsScreen';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useSavedPosts, useViewType } from '@src/state';
import CompactOrFull from '@components/Feed/components/Feed/CompactOrFull';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { useTheme, YStack } from 'tamagui';

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <CompactOrFull itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

export default function SavedPostsScreen(): React.JSX.Element {
  const theme = useTheme();

  const viewType = useViewType();

  const profileScreenContext = useProfileScreenContext();
  const savedPostsTab = useSavedPostsTab();

  const savedPosts = useSavedPosts();

  return (
    <YStack flex={1}>
      <FlashList<number>
        renderItem={renderItem}
        data={savedPosts}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={savedPostsTab.onEndReached}
        estimatedItemSize={viewType === 'compact' ? 100 : 350}
        scrollEventThrottle={16}
        onScroll={profileScreenContext.onScroll}
        ListEmptyComponent={
          <FeedLoadingIndicator
            loading={savedPostsTab.isLoading}
            error={savedPostsTab.isError}
            empty={savedPosts != null && savedPosts.length < 1}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={savedPostsTab.isRefreshing}
            onRefresh={savedPostsTab.refresh}
          />
        }
        contentContainerStyle={{ backgroundColor: theme.bg.val }}
      />
    </YStack>
  );
}
