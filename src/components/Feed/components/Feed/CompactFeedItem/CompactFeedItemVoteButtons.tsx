import React from 'react';
import { YStack } from 'tamagui';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';

interface IProps {
  itemId: number;
}

export default function CompactFeedItemVoteButtons({
  itemId,
}: IProps): React.JSX.Element {
  return (
    <YStack space="$1" justifyContent="center" alignItems="center" mx="$1.5">
      <PostUpvoteButton itemId={itemId} />
      <PostDownvoteButton itemId={itemId} />
    </YStack>
  );
}
