import React, { useMemo } from 'react';
import {
  useDownvotesAllowed,
  useMentionPublished,
  useReplyPublished,
  useSettingsStore,
} from '@src/state';
import { Text, XStack } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import { ArrowDown, ArrowUp, Clock } from '@tamagui/lucide-icons';
import { useInboxReplyVoting } from '@components/Inbox/hooks/useInboxReplyVoting';
import { getTimeFrom } from '@helpers/time';

interface IProps {
  itemId: number;
  commentId: number;
  type: 'reply' | 'mention';
}

function InboxReplyMetrics({
  itemId,
  commentId,
  type,
}: IProps): React.JSX.Element {
  const downvotesAllowed = useDownvotesAllowed();

  const voting = useInboxReplyVoting(itemId, commentId, type);

  const published =
    type === 'reply' ? useReplyPublished(itemId) : useMentionPublished(itemId);
  const timestamp = useMemo(() => getTimeFrom(published), [published]);

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
      <XStack space="$2">
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
        <XStack space="$1.5" alignItems="center">
          <Clock size={14} color="$secondary" />
          <Text fontSize="$2" color="$secondary">
            {timestamp}
          </Text>
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
          <ArrowUp size={14} color={upvoteColor} />
          <Text fontSize="$2" color={upvoteColor}>
            {voting.upvotes}
          </Text>
        </XStack>
        {downvotesAllowed && (
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
        )}
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

export default React.memo(InboxReplyMetrics);
