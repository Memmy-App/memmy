import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import CommunityHeader from '@components/Feed/components/Community/CommunityHeader';
import FeedItem from '@components/Feed/components/Feed/FeedItem';
import { PostView } from 'lemmy-js-client';
import { useProfilePosts } from '@src/state/profile/profileStore';

const renderItem = ({
  item,
}: ListRenderItemInfo<PostView>): React.JSX.Element => {
  return <FeedItem itemId={item.post.id} />;
};

const keyExtractor = (item: PostView): string => item.post.id.toString();

export default function ProfilePostsTab(): React.JSX.Element {
  const profileContext = useProfileScreenContext();
  const profilePosts = useProfilePosts(profileContext.profileId);

  return (
    <VStack flex={1}>
      <FlashList<PostView>
        renderItem={renderItem}
        data={profilePosts}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        estimatedItemSize={300}
        ListHeaderComponent={<CommunityHeader />}
        onScroll={profileContext.onScroll}
        // ListFooterComponent={
        //   <FeedLoadingIndicator
        //     loading={mainFeed.isLoading && !mainFeed.isRefreshing}
        //     error={mainFeed.isError}
        //   />
        // }
        // @ts-expect-error - This is valid but useScrollToTop expect a ref to a FlatList
        // ref={mainFeed.flashListRef}
      />
    </VStack>
  );
}
