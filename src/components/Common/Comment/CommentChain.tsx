import React, { useMemo } from 'react';
import { ICommentInfo } from '@src/types';
import { View } from 'tamagui';
import { createCommentReplyComponents } from '@helpers/comments';
import Comment from '@components/Common/Comment/Comment';

interface IProps {
  commentInfo: ICommentInfo;
  showReplies?: boolean;
}

function CommentChain({
  commentInfo,
  showReplies = true,
}: IProps): React.JSX.Element {
  const replies = useMemo(
    () =>
      showReplies ? createCommentReplyComponents(commentInfo.replies) : [],
    [commentInfo],
  );

  return (
    <View>
      <Comment itemId={commentInfo.commentId} depth={commentInfo.depth} />
      {replies}
    </View>
  );
}

export default React.memo(CommentChain);
