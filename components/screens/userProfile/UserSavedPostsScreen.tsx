import React from "react";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import useProfile from "../../hooks/profile/useProfile";
import CompactFeedItem from "../../ui/Feed/CompactFeedItem/CompactFeedItem";
import NoResultView from "../../ui/common/NoResultView";
import { ProfileRefreshControl } from "../../ui/profile/ProfileRefreshControl";
import LoadingView from "../../ui/Loading/LoadingView";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import NotFoundView from "../../ui/Loading/NotFoundView";

interface IProps {
  route: any;
}

function UserSavedPostsScreen({ route }: IProps) {
  const profile = useProfile(route?.params?.fullUsername);

  const keyExtractor = (item: PostView) => item.post.id.toString();

  const renderItem = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={() => profile.doLoad(true)} />;
  }

  if (profile.notFound) {
    return <NotFoundView />;
  }

  return (
    <FlashList
      renderItem={renderItem}
      estimatedItemSize={150}
      data={profile.savedPosts}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<NoResultView type="profilePosts" p={4} />}
      refreshing={profile.loading}
      refreshControl={
        <ProfileRefreshControl
          refreshing={profile.refreshing}
          doLoad={profile.doLoad}
        />
      }
    />
  );
}

export default UserSavedPostsScreen;
