import React from 'react';
import { useRoute } from '@react-navigation/core';
import { usePostTitle } from '@src/state/post/postStore';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import { Text } from 'tamagui';
import VStack from '@components/Common/Stack/VStack';

function PostHeader(): React.JSX.Element {
  const { postId } = useRoute<any>().params;
  const postTitle = usePostTitle(postId);

  return (
    <VStack paddingHorizontal="$3" paddingTop="$3">
      <PostCommunityLabel itemId={postId} />
      <Text fontSize="$8" fontWeight="bold">
        {postTitle}
      </Text>
    </VStack>
  );
}

export default React.memo(PostHeader);
