import React from 'react';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { PostView } from 'lemmy-js-client';
import { useProfilePosts } from '@src/state';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { useTheme } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import ProfileInfo from '@components/Profile/components/ProfileInfo';

const renderItem = ({
  item,
}: ListRenderItemInfo<PostView>): React.JSX.Element => {
  return <FeedItem itemId={item.post.id} />;
};

const keyExtractor = (item: PostView): string => item.post.id.toString();

function ProfilePostsTab(): React.JSX.Element {
  const profileScreenContext = useProfileScreenContext();
  const profilePosts = useProfilePosts(profileScreenContext.profileId);

  const theme = useTheme();

  return (
    <FlashList<PostView>
      renderItem={renderItem}
      data={profilePosts}
      keyExtractor={keyExtractor}
      estimatedItemSize={300}
      onScroll={profileScreenContext.onScroll}
      ListHeaderComponent={<ProfileInfo />}
      ListEmptyComponent={
        <FeedLoadingIndicator
          loading={profileScreenContext.isLoading}
          error={profileScreenContext.isError}
          empty={profilePosts != null && profilePosts.length < 1}
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

export default React.memo(ProfilePostsTab);
