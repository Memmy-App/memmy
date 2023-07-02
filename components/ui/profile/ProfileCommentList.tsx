import React, { ReactElement } from "react";
import { FlashList } from "@shopify/flash-list";
import NoResultView from "../common/NoResultView";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import { UseProfile } from "../../hooks/profile/useProfile";
import { ProfileRefreshControl } from "./ProfileRefreshControl";
import CommentItem from "../comments/CommentItem";

interface IProps {
  profile: UseProfile;
  header: ReactElement;
}

function ProfileCommentList({ profile, header }: IProps) {
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

  return (
    <FlashList
      renderItem={renderComment}
      ListHeaderComponent={header}
      estimatedItemSize={150}
      data={profile.comments}
      keyExtractor={commentKeyExtractor}
      ListEmptyComponent={<NoResultView type="profileComments" />}
      refreshing={profile.loading}
      refreshControl={<ProfileRefreshControl profile={profile} />}
    />
  );
}

export default ProfileCommentList;
