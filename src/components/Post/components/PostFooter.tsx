import React from 'react';
import { useRoute } from '@react-navigation/core';
import VStack from '@components/Common/Stack/VStack';
import PostMetrics from '@components/Common/PostCard/PostMetrics';
import PostUserLabel from '@components/Common/PostCard/PostUserLabel';
import { usePostCreator } from '@src/state/post/postStore';

function PostFooter(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const user = usePostCreator(postId);

  return (
    <VStack space="$1.5" paddingVertical="$2" paddingHorizontal="$3">
      <PostUserLabel
        userIcon={user?.avatar}
        userCommunity={user?.actor_id}
        userName={user?.name}
      />
      <PostMetrics itemId={postId} />
    </VStack>
  );
}

export default React.memo(PostFooter);
