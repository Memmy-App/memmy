import React from 'react';
import { useRoute } from '@react-navigation/core';
import { usePostTitle } from '@src/state';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import { Text, XStack, YStack } from 'tamagui';
import PostContextButton from '@components/Post/components/PostContextButton';

function PostHeader(): React.JSX.Element {
  const { postId } = useRoute<any>().params;
  const postTitle = usePostTitle(postId);

  return (
    <YStack
      px="$3"
      pt="$3"
      pb="$2"
      borderBottomWidth={1}
      borderColor="$bg"
      space="$1.5"
    >
      <XStack alignItems="center">
        <PostCommunityLabel itemId={postId} />
        <PostContextButton itemId={postId} />
      </XStack>
      <Text fontSize="$5" fontWeight="bold">
        {postTitle}
      </Text>
    </YStack>
  );
}

export default React.memo(PostHeader);
