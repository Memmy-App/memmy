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
  useSettingsStore,
} from '@src/state';
import { Text } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';

interface IProps {
  itemId: number;
}

function PostMetrics({ itemId }: IProps): React.JSX.Element {
  const showTotalScore = useSettingsStore((state) => state.totalScore);

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
  const scoreColor = useMemo(
    () =>
      postMyVote === 1
        ? '$upvote'
        : postMyVote === -1
        ? '$downvote'
        : '$secondary',
    [postMyVote],
  );

  return (
    <HStack space="$2" alignItems="center">
      {showTotalScore ? (
        <HStack space="$1" alignItems="center">
          <ScoreIcon myVote={postMyVote} />
          <Text fontSize={13} color={scoreColor}>
            {postCounts?.score}
          </Text>
        </HStack>
      ) : (
        <HStack space="$2">
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
        </HStack>
      )}

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
