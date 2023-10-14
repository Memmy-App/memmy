import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import PostHeader from '@components/Post/components/PostHeader';
import PostContent from '@components/Post/components/PostContent';
import PostActionBar from '@components/Post/components/PostActionBar';
import PostFooter from '@components/Post/components/PostFooter';

function Post(): React.JSX.Element {
  return (
    <VStack backgroundColor="$fg">
      <PostHeader />
      <PostContent />
      <PostFooter />
      <PostActionBar />
    </VStack>
  );
}

export default React.memo(Post);
