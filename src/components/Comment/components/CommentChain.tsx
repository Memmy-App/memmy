import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { PressableComment } from '@components/Comment/components/Comment';
import { setPostCommentHidden } from '@src/state/post/actions/setPostCommentHidden';
import { ViewToken } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

interface IProps {
  commentInfo: ICommentInfo;
  viewableItems: SharedValue<ViewToken[]>;
}

function CommentChain({
  commentInfo,
  viewableItems,
}: IProps): React.JSX.Element | null {
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
