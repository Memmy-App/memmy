import React from "react";
import { FlashList } from "@shopify/flash-list";
import { VStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import NoResultView from "../../common/NoResultView";
import CommentItem from "../../common/Comments/CommentItem";
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

  const theme = useAppSelector(selectThemeOptions);

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
