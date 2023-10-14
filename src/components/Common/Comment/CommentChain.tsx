import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { PressableComment } from '@components/Common/Comment/Comment';
import { setPostCommentHidden } from '@src/state/post/actions/setPostCommentHidden';

interface IProps {
  commentInfo: ICommentInfo;
  showReplies?: boolean;
}

function CommentChain({ commentInfo }: IProps): React.JSX.Element | null {
  const onCommentPress = useCallback(() => {
    setPostCommentHidden(commentInfo, !commentInfo.collapsed);
  }, [commentInfo.collapsed]);

  if (commentInfo.hidden) {
    return null;
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
