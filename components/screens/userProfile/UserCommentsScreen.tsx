import React from "react";
import { FlashList } from "@shopify/flash-list";
import { useTheme, VStack } from "native-base";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import NoResultView from "../../ui/common/NoResultView";
import { ProfileRefreshControl } from "../../ui/profile/ProfileRefreshControl";
import CommentItem from "../../ui/comments/CommentItem";
import useProfile from "../../hooks/profile/useProfile";
import LoadingView from "../../ui/Loading/LoadingView";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import NotFoundView from "../../ui/Loading/NotFoundView";

interface IProps {
  route: any;
}

function UserCommentsScreen({ route }: IProps) {
  const profile = useProfile(false, route?.params?.fullUsername);

  const theme = useTheme();

  const onPressOverride = (item) => {
    const commentPathArr = item.comment.comment.path.split(".");

    if (commentPathArr.length === 2) {
      profile
        .onCommentPress(item.comment.post.id, item.comment.comment.id)
        .then();
    } else {
      profile
        .onCommentPress(
          item.comment.post.id,
          Number(commentPathArr[commentPathArr.length - 2])
        )
        .then();
    }
  };

  const commentKeyExtractor = (item) => item.comment.comment.id.toString();

  const renderComment = ({ item }: { item: ILemmyComment }) => (
    <CommentItem
      comment={item}
      setComments={profile.setComments}
      opId={0}
      depth={2}
      onPressOverride={() => onPressOverride(item)}
    />
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
        renderItem={renderComment}
        estimatedItemSize={150}
        data={profile.comments}
        keyExtractor={commentKeyExtractor}
        ListEmptyComponent={<NoResultView type="profileComments" p={4} />}
        refreshing={profile.loading}
        refreshControl={
          <ProfileRefreshControl
            refreshing={profile.refreshing}
            doLoad={profile.doLoad}
          />
        }
      />
    </VStack>
  );
}

export default UserCommentsScreen;
