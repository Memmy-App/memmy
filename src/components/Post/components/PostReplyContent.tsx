import React from 'react';
import { XStack, YStack } from 'tamagui';
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
    <YStack backgroundColor="$fg">
      <YStack
        marginVertical="$2"
        paddingHorizontal="$2"
        paddingVertical="$1"
        space="$3"
      >
        <FeedItemHeader itemId={itemId} />
        <Markdown>{postContent}</Markdown>
        <XStack justifyContent="space-between" paddingHorizontal="$2">
          <PostUserLabel
            userIcon={user?.avatar}
            userName={user?.name}
            userCommunity=""
          />
          <PostMetrics itemId={itemId} />
        </XStack>
      </YStack>
    </YStack>
  );
}

export default React.memo(PostReplyContent);
