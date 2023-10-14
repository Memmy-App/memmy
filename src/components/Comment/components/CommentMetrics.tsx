import React, { useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Text } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import { Pressable } from 'react-native';
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

  if (totalScore) {
    return (
      <HStack space="$1">
        <ScoreIcon myVote={voting.myVote} />
        <Text color="$secondary">{voting.score}</Text>
      </HStack>
    );
  } else {
    return (
      <HStack space="$2">
        <Pressable onPress={voting.upvote} hitSlop={3}>
          <HStack space="$1">
            <ArrowUp size={14} color={upvoteColor} />
            <Text color={upvoteColor}>{voting.upvotes}</Text>
          </HStack>
        </Pressable>
        <Pressable onPress={voting.downvote} hitSlop={3}>
          <HStack space="$1">
            <ArrowDown size={14} color={downvoteColor} />
            <Text color={downvoteColor}>{voting.downvotes}</Text>
          </HStack>
        </Pressable>
      </HStack>
    );
  }
}

export default React.memo(CommentMetrics);
