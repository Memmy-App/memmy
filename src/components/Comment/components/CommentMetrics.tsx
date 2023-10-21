import React, { useMemo } from 'react';
import { useSettingsStore } from '@src/state';
import { Text, XStack } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';
import { useCommentVoting } from '@hooks/comments/useCommentVoting';

interface IProps {
  itemId: number;
}

function CommentMetrics({ itemId }: IProps): React.JSX.Element {
  const voting = useCommentVoting(itemId, true);

  const totalScore = useSettingsStore((state) => state.totalScore);

  const upvoteColor = useMemo(
    () => (voting.myVote === 1 ? '$upvote' : '$secondary'),
    [voting.myVote],
  );
  const downvoteColor = useMemo(
    () => (voting.myVote === -1 ? '$downvote' : '$secondary'),
    [voting.myVote],
  );
  const scoreColor = useMemo(
    () =>
      voting.myVote === 1
        ? '$upvote'
        : voting.myVote === -1
        ? '$downvote'
        : '$secondary',
    [voting.myVote],
  );

  if (totalScore) {
    return (
      <XStack
        space="$1"
        onPress={voting.scoreVote}
        hitSlop={3}
        alignItems="center"
      >
        <ScoreIcon myVote={voting.myVote} />
        <Text fontSize="$2" color={scoreColor}>
          {voting.score}
        </Text>
      </XStack>
    );
  } else {
    return (
      <XStack space="$2">
        <XStack
          space="$1"
          onPress={voting.upvote}
          hitSlop={3}
          alignItems="center"
        >
          <ArrowUp size={14} color={upvoteColor} />
          <Text fontSize="$2" color={upvoteColor}>
            {voting.upvotes}
          </Text>
        </XStack>
        <XStack
          space="$1"
          onPress={voting.downvote}
          hitSlop={3}
          alignItems="center"
        >
          <ArrowDown size={14} color={downvoteColor} />
          <Text fontSize="$2" color={downvoteColor}>
            {voting.downvotes}
          </Text>
        </XStack>
      </XStack>
    );
  }
}

export default React.memo(CommentMetrics);
