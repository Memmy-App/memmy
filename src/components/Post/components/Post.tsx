import React from 'react';
import PostHeader from '@components/Post/components/PostHeader';
import PostContent from '@components/Post/components/PostContent';
import PostActionBar from '@components/Post/components/PostActionBar';
import PostFooter from '@components/Post/components/PostFooter';
import { YStack } from 'tamagui';

function Post(): React.JSX.Element {
  return (
    <YStack backgroundColor="$fg">
      <PostHeader />
      <PostContent />
      <PostFooter />
      <PostActionBar />
    </YStack>
  );
}

export default React.memo(Post);
