import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import PostHeader from '@components/Post/components/PostHeader';
import PostContent from '@components/Post/components/PostContent';
import PostActionBar from '@components/Post/components/PostActionBar';

function Post(): React.JSX.Element {
  return (
    <VStack backgroundColor="$fg">
      <PostHeader />
      <PostContent />
      <PostActionBar />
    </VStack>
  );
}

export default React.memo(Post);
