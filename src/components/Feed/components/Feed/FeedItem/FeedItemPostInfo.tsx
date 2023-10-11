import React from 'react';
import PostUserLabel from '@components/Common/PostCard/PostUserLabel';
import VStack from '@components/Common/Stack/VStack';
import { usePostCreator } from '@src/state/post/postStore';
import PostMetrics from '@components/Common/PostCard/PostMetrics';

interface IProps {
  itemId: number;
}

export default function FeedItemPostInfo({
  itemId,
}: IProps): React.JSX.Element {
  const postUser = usePostCreator(itemId);

  return (
    <VStack space="$2">
      <PostUserLabel
        userName={postUser?.name}
        userCommunity={postUser?.actor_id}
        userIcon={postUser?.avatar}
      />
      <PostMetrics itemId={itemId} />
    </VStack>
  );
}
