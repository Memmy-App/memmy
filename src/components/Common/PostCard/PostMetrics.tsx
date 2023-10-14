import React, { useMemo } from 'react';
import HStack from '@components/Common/Stack/HStack';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  MessageSquare,
} from '@tamagui/lucide-icons';
import {
  usePostCommentCount,
  usePostCounts,
  usePostMyVote,
} from '@src/state/post/postStore';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function PostMetrics({ itemId }: IProps): React.JSX.Element {
  const postCounts = usePostCounts(itemId);
  const postCommentCount = usePostCommentCount(itemId);
  const postMyVote = usePostMyVote(itemId);

  const upvoteColor = useMemo(
    () => (postMyVote === 1 ? '$upvote' : '$secondary'),
    [postMyVote],
  );
  const downvoteColor = useMemo(
    () => (postMyVote === -1 ? '$downvote' : '$secondary'),
    [postMyVote],
  );

  return (
    <HStack space="$2" alignItems="center">
      <HStack space="$1" alignItems="center">
        <ArrowUp size={14} color={upvoteColor} />
        <Text color={upvoteColor} fontSize={13}>
          {postCounts?.upvotes}
        </Text>
      </HStack>
      <HStack space="$1" alignItems="center">
        <ArrowDown size={14} color={downvoteColor} />
        <Text color={downvoteColor} fontSize={13}>
          {postCounts?.downvotes}
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
