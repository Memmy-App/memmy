import React, { useMemo } from 'react';
import { useCommentPublished, useShowTotalScore } from '@src/state';
import { Text, XStack } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import { ArrowDown, ArrowUp, Clock } from '@tamagui/lucide-icons';
import { useCommentVoting } from '@hooks/comments/useCommentVoting';
import { getTimeFrom } from '@helpers/time';
import { useMetricsColors } from '@hooks/useMetricsColors';

interface IProps {
  itemId: number;
}

function CommentMetrics({ itemId }: IProps): React.JSX.Element {
  const commentPublished = useCommentPublished(itemId);
  const voting = useCommentVoting(itemId, true);
  const showTotalScore = useShowTotalScore();
  const metricsColors = useMetricsColors(voting.myVote);

  const timestamp = useMemo(
    () => getTimeFrom(commentPublished),
    [commentPublished],
  );

  if (showTotalScore) {
    return (
      <XStack space="$2">
        <XStack
          space="$1"
          onPress={voting.scoreVote}
          hitSlop={3}
          alignItems="center"
        >
          <ScoreIcon myVote={voting.myVote} />
          <Text fontSize="$2" color={metricsColors.scoreColor}>
            {voting.score}
          </Text>
        </XStack>
        <XStack space="$1" alignItems="center">
          <Clock size={14} color="$secondary" />
          <Text color="$secondary">{timestamp}</Text>
        </XStack>
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
          <ArrowUp size={14} color={metricsColors.upvoteColor} />
          <Text fontSize="$2" color={metricsColors.upvoteColor}>
            {voting.upvotes}
          </Text>
        </XStack>
        <XStack
          space="$1"
          onPress={voting.downvote}
          hitSlop={3}
          alignItems="center"
        >
          <ArrowDown size={14} color={metricsColors.downvoteColor} />
          <Text fontSize="$2" color={metricsColors.downvoteColor}>
            {voting.downvotes}
          </Text>
        </XStack>
        <XStack space="$1.5" alignItems="center">
          <Clock size={14} color="$secondary" />
          <Text fontSize="$2" color="$secondary">
            {timestamp}
          </Text>
        </XStack>
      </XStack>
    );
  }
}

export default React.memo(CommentMetrics);
