import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { PressableComment } from '@components/Comment/components/Comment';
import { setPostCommentHidden } from '@src/state/post/actions/setPostCommentHidden';
import CommentShowMoreButton from '@components/Comment/components/CommentShowMoreButton';

interface IProps {
  commentInfo: ICommentInfo;
  ignoreLoadMore?: boolean;
}

function CommentChain({
  commentInfo,
  ignoreLoadMore = false,
}: IProps): React.JSX.Element | null {
  const onCommentPress = useCallback(() => {
    setPostCommentHidden(commentInfo, !commentInfo.collapsed);
  }, [commentInfo.collapsed]);

  if (commentInfo.hidden) {
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
    />
  );
}

export default React.memo(CommentChain);
