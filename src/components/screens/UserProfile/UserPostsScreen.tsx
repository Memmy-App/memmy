import React from "react";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { useTheme, VStack } from "native-base";
import useProfile from "../../../hooks/profile/useProfile";
import CompactFeedItem from "../Feed/components/CompactFeedItem/CompactFeedItem";
import NoResultView from "../../common/NoResultView";
import LoadingView from "../../common/Loading/LoadingView";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import RefreshControl from "../../common/RefreshControl";

interface IProps {
  route: any;
}

function UserPostsScreen({ route }: IProps) {
  const profile = useProfile(false, route?.params?.fullUsername);

  const theme = useTheme();

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
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <FlashList
        renderItem={renderItem}
        estimatedItemSize={150}
        data={profile.posts}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<NoResultView type="profilePosts" p={4} />}
        refreshing={profile.loading}
        refreshControl={
          <RefreshControl
            refreshing={profile.refreshing}
            onRefresh={profile.doLoad}
          />
        }
      />
    </VStack>
  );
}

export default UserPostsScreen;
