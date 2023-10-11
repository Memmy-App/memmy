import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  MessageSquare,
} from '@tamagui/lucide-icons';
import { usePostCommentCount, usePostVotes } from '@src/state/post/postStore';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function PostMetrics({ itemId }: IProps): React.JSX.Element {
  const postVotes = usePostVotes(itemId);
  const postCommentCount = usePostCommentCount(itemId);

  return (
    <HStack space="$2" alignItems="center">
      <HStack space="$1" alignItems="center">
        <ArrowUp size={14} color="$secondary" />
        <Text color="$secondary" fontSize={13}>
          {postVotes?.upvotes}
        </Text>
      </HStack>
      <HStack space="$1" alignItems="center">
        <ArrowDown size={14} color="$secondary" />
        <Text color="$secondary" fontSize={13}>
          {postVotes?.downvotes}
        </Text>
      </HStack>
      <HStack space="$1" alignItems="center">
        <MessageSquare size={14} color="$secondary" />
        <Text color="$secondary" fontSize={13}>
          {postCommentCount}
        </Text>
      </HStack>
      <HStack space="$1" alignItems="center">
        <Clock size={14} color="$secondary" />
        <Text color="$secondary" fontSize={13}>
          {postCommentCount}
        </Text>
      </HStack>
    </HStack>
  );
}

export default React.memo(PostMetrics);
