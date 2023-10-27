import React from 'react';
import { XStack } from 'tamagui';
import CommentVoteButton from '@components/Comment/components/CommentVoteButton';
import CommentReplyButton from '@components/Comment/components/CommentReplyButton';

interface IProps {
  itemId: number;
}

function CommentActionBar({ itemId }: IProps): React.JSX.Element {
  return (
    <XStack
      borderColor="$bg"
      ml="auto"
      mr="$2.5"
      space="$3"
      mt={-3}
      alignItems="center"
    >
      <CommentReplyButton itemId={itemId} />
      <CommentVoteButton itemId={itemId} type="upvote" />
      <CommentVoteButton itemId={itemId} type="downvote" />
    </XStack>
  );
}

export default React.memo(CommentActionBar);
