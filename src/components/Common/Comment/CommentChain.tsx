import React, { useCallback } from 'react';
import { ICommentInfo } from '@src/types';
import { View } from 'tamagui';
import Comment from '@components/Common/Comment/Comment';
import { Pressable } from 'react-native';
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
    <Pressable onPress={onCommentPress}>
      <View>
        <Comment
          itemId={commentInfo.commentId}
          depth={commentInfo.depth}
          collapsed={commentInfo.collapsed}
        />
      </View>
    </Pressable>
  );
}

export default React.memo(CommentChain);
