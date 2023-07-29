import React from "react";
import { FlashList } from "@shopify/flash-list";
import { VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import ProfileCommentItem from "@src/components/screens/UserProfile/components/ProfileCommentItem";
import NoResultView from "../../common/NoResultView";
import useProfile from "../../../hooks/profile/useProfile";
import LoadingView from "../../common/Loading/LoadingView";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";

interface IProps {
  route: any;
}

function UserCommentsScreen({ route }: IProps) {
  const profile = useProfile(false, route?.params?.fullUsername);

  const theme = useThemeOptions();

  const commentKeyExtractor = (item) => item.comment.comment.id.toString();

  const renderComment = ({ item }: { item: ILemmyComment }) => (
    <ProfileCommentItem comment={item} />
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
    <VStack flex={1} backgroundColor={theme.colors.bg}>
      <FlashList
        renderItem={renderComment}
        estimatedItemSize={150}
        data={profile.comments}
        keyExtractor={commentKeyExtractor}
        ListEmptyComponent={<NoResultView type="profileComments" p="$4" />}
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

export default UserCommentsScreen;
