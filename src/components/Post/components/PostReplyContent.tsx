import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import PostUserLabel from '@components/Common/PostCard/PostUserLabel';
import { usePostBody, usePostCreator } from '@src/state';
import PostMetrics from '@components/Common/PostCard/PostMetrics';
import Markdown from '@components/Common/Markdown/Markdown';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';

interface IProps {
  itemId: number;
}

function PostReplyContent({ itemId }: IProps): React.JSX.Element {
  const user = usePostCreator(itemId);
  const postContent = usePostBody(itemId);

  return (
    <VStack backgroundColor="$fg">
      <VStack
        marginVertical="$2"
        paddingHorizontal="$2"
        paddingVertical="$1"
        space="$3"
      >
        <FeedItemHeader itemId={itemId} />
        <Markdown>{postContent}</Markdown>
        <HStack justifyContent="space-between" paddingHorizontal="$2">
          <PostUserLabel
            userIcon={user?.avatar}
            userName={user?.name}
            userCommunity=""
          />
          <PostMetrics itemId={itemId} />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(PostReplyContent);
