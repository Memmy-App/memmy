import React from 'react';
import { usePostBody } from '@src/state/post/postStore';
import VStack from '@components/Common/Stack/VStack';
import { useRoute } from '@react-navigation/core';
import PostHeader from '@components/Post/components/PostHeader';
import PostContent from '@components/Post/components/PostContent';

function Post(): React.JSX.Element {
  const { postId } = useRoute<any>().params;

  const postBody = usePostBody(postId);

  return (
    <VStack backgroundColor="$fg">
      <PostHeader />
      <PostContent />
    </VStack>
  );
}

export default React.memo(Post);
