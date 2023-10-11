import React from 'react';
import { usePost } from '@src/state/post/postStore';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';
import { useRoute } from '@react-navigation/core';

function Post(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const post = usePost(postId);

  return (
    <VStack>
      <Text>{post?.name}</Text>
    </VStack>
  );
}

export default React.memo(Post);
