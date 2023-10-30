import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { PressableComment } from '@components/Comment/components/Comment';
import CommentShowMoreButton from '@components/Comment/components/CommentShowMoreButton';
import { useCommentSwipeOptions } from '@components/Common/SwipeableRow/hooks/useCommentSwipeOptions';
import { setPostCommentHidden, useCommentGesturesCollapse } from '@src/state';

interface IProps {
  commentInfo: ICommentInfo;
  ignoreLoadMore?: boolean;
}

function CommentChain({
  commentInfo,
  ignoreLoadMore = false,
}: IProps): React.JSX.Element | null {
  const collapseOnTap = useCommentGesturesCollapse();

  const leftOptions = useCommentSwipeOptions('left');
  const rightOptions = useCommentSwipeOptions('right');

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
      leftOptions={leftOptions}
      rightOptions={rightOptions}
    />
  );
}

export default React.memo(CommentChain);
