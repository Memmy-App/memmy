import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import PostUpvoteButton from '@components/Common/PostCard/PostUpvoteButton';
import PostDownvoteButton from '@components/Common/PostCard/PostDownvoteButton';
import PostSaveButton from '@components/Common/PostCard/PostSaveButton';

interface IProps {
  itemId: number;
}

export default function FeedItemActionButtons({
  itemId,
}: IProps): React.JSX.Element {
  return (
    <HStack space="$1.5" marginLeft="auto">
      <PostSaveButton itemId={itemId} />
      <PostUpvoteButton itemId={itemId} />
      <PostDownvoteButton itemId={itemId} />
    </HStack>
  );
}
