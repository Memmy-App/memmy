import React, { useCallback, useMemo } from 'react';
import { ICommentInfo } from '@src/types';
import { PressableComment } from '@components/Comment/components/Comment';
import CommentShowMoreButton from '@components/Comment/components/CommentShowMoreButton';
import { useCommentSwipeOptions } from '@components/Common/SwipeableRow/hooks/useCommentSwipeOptions';
import { setPostCommentHidden, useCommentGesturesCollapse } from '@src/state';
import { SwipeableActionParams } from '@helpers/swipeableActions';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IProps {
  commentInfo: ICommentInfo;
  ignoreLoadMore?: boolean;
}

function CommentChain({
  commentInfo,
  ignoreLoadMore = false,
}: IProps): React.JSX.Element | null {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const collapseOnTap = useCommentGesturesCollapse();

  const actionParams = useMemo<SwipeableActionParams>(
    () => ({
      postId: commentInfo.postId,
      commentId: commentInfo.commentId,
      path: commentInfo.path,
      navigation,
    }),
    [commentInfo.commentId],
  );

  const leftOptions = useCommentSwipeOptions('left', actionParams);
  const rightOptions = useCommentSwipeOptions('right', actionParams);

  const onCommentPress = useCallback(() => {
    if (!collapseOnTap) return;

    setPostCommentHidden({
      commentId: commentInfo.commentId,
      postId: commentInfo.postId,
      path: commentInfo.path,
    });
  }, [commentInfo.commentId, collapseOnTap]);

  if (commentInfo.hidden || !commentInfo.showInPost) {
    return null;
  }

  if (commentInfo.showLoadMore && !ignoreLoadMore) {
    return <CommentShowMoreButton commentInfo={commentInfo} />;
  }

  return (
    <PressableComment
      onPress={onCommentPress}
      itemId={commentInfo.commentId}
      depth={commentInfo.depth}
      collapsed={commentInfo.collapsed}
      leftOptions={leftOptions ?? undefined}
      rightOptions={rightOptions ?? undefined}
    />
  );
}

export default React.memo(CommentChain);
