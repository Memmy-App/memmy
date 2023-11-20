/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { PostView } from 'lemmy-js-client';
import { useRecentPostHistory, addOrUpdatePost } from '@src/state';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useTheme } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';

const renderItem = ({
  item,
}: ListRenderItemInfo<PostView>): React.JSX.Element => {
  return <FeedItem itemId={item.post.id} />;
};

const keyExtractor = (item: PostView): string => item.post.id.toString();

function ProfileRecentPostHistoryTab(): React.JSX.Element {
  const profileScreenContext = useProfileScreenContext();
  const recentPostsHistory = useRecentPostHistory();

  useEffect(() => {
    recentPostsHistory?.map((post) => {
      addOrUpdatePost({ post });
      return true;
    });
    return () => {};
  }, [recentPostsHistory]);

  const theme = useTheme();

  return (
    <FlashList<PostView>
      renderItem={renderItem}
      data={recentPostsHistory}
      keyExtractor={keyExtractor}
      estimatedItemSize={350}
      onScroll={profileScreenContext.onScroll}
      // ListHeaderComponent={<ProfileInfo />}
      ListEmptyComponent={
        <FeedLoadingIndicator
          loading={profileScreenContext.isLoading}
          error={profileScreenContext.isError}
          empty={recentPostsHistory != null && recentPostsHistory.length < 1}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={profileScreenContext.isRefreshing}
          onRefresh={profileScreenContext.refresh}
        />
      }
      scrollEventThrottle={16}
      contentContainerStyle={{ backgroundColor: theme.bg.val }}
    />
  );
}

export default React.memo(ProfileRecentPostHistoryTab);
