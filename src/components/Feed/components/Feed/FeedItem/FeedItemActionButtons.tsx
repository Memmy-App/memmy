import React from 'react';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';
import PostSaveButton from '@components/Common/PostCard/PostSaveButton';
import { XStack } from 'tamagui';

interface IProps {
  itemId: number;
}

export default function FeedItemActionButtons({
  itemId,
}: IProps): React.JSX.Element {
  return (
    <XStack space="$1.5" ml="auto">
      <PostSaveButton itemId={itemId} />
      <PostUpvoteButton itemId={itemId} />
      <PostDownvoteButton itemId={itemId} />
    </XStack>
  );
}
