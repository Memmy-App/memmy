import React from 'react';
import { XStack } from 'tamagui';
import CommentVoteButton from '@components/Comment/components/CommentVoteButton';

interface IProps {
  itemId: number;
}

function CommentActionBar({ itemId }: IProps): React.JSX.Element {
  return (
    <XStack borderColor="$bg" ml="auto" mr="$2.5" space="$3" mt={-3}>
      <CommentVoteButton itemId={itemId} type="upvote" />
      <CommentVoteButton itemId={itemId} type="downvote" />
    </XStack>
  );
}

export default React.memo(CommentActionBar);
