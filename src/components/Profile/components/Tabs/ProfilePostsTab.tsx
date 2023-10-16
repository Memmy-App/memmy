import React from 'react';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { PostView } from 'lemmy-js-client';
import { useProfilePosts } from '@src/state/profile/profileStore';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';

const renderItem = ({
  item,
}: ListRenderItemInfo<PostView>): React.JSX.Element => {
  return <FeedItem itemId={item.post.id} />;
};

const keyExtractor = (item: PostView): string => item.post.id.toString();

function ProfilePostsTab(): React.JSX.Element {
  const profileScreenContext = useProfileScreenContext();
  const profilePosts = useProfilePosts(profileScreenContext.profileId);

  return (
    <FlashList<PostView>
      renderItem={renderItem}
      data={profilePosts}
      keyExtractor={keyExtractor}
      estimatedItemSize={300}
      onScroll={profileScreenContext.onScroll}
      ListEmptyComponent={
        <FeedLoadingIndicator
          loading={profileScreenContext.isLoading}
          error={profileScreenContext.isError}
        />
      }
      scrollEventThrottle={16}
    />
  );
}

export default React.memo(ProfilePostsTab);
