import React from 'react';
import { useRoute } from '@react-navigation/core';
import PostMetrics from '@components/Common/PostCard/PostMetrics';
import PostUserLabel from '@components/Common/PostCard/PostUserLabel';
import { usePostCreator } from '@src/state';
import { YStack } from 'tamagui';

function PostFooter(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const user = usePostCreator(postId);

  return (
    <YStack space="$1.5" py="$2" px="$3">
      <PostUserLabel
        userIcon={user?.avatar}
        userCommunity={user?.actor_id}
        userName={user?.name}
        isAdmin={user?.admin}
      />
      <PostMetrics itemId={postId} />
    </YStack>
  );
}

export default React.memo(PostFooter);
