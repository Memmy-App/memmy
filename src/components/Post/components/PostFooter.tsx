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
    <YStack space="$1.5" paddingVertical="$2" paddingHorizontal="$3">
      <PostUserLabel
        userIcon={user?.avatar}
        userCommunity={user?.actor_id}
        userName={user?.name}
      />
      <PostMetrics itemId={postId} />
    </YStack>
  );
}

export default React.memo(PostFooter);
