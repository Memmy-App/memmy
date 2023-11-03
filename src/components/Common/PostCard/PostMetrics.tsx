import React, { useMemo } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  MessageSquare,
} from '@tamagui/lucide-icons';
import {
  useDownvotesAllowed,
  usePostCommentCount,
  usePostCounts,
  usePostMyVote,
  usePostPublished,
  useSettingsStore,
} from '@src/state';
import { Text, XStack } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import { getTimeFrom } from '@helpers/time';

interface IProps {
  itemId: number;
}

function PostMetrics({ itemId }: IProps): React.JSX.Element {
  const showTotalScore = useSettingsStore((state) => state.totalScore);

  const downvotesAllowed = useDownvotesAllowed();

  const postCounts = usePostCounts(itemId);
  const postCommentCount = usePostCommentCount(itemId);
  const postMyVote = usePostMyVote(itemId);
  const postPublished = usePostPublished(itemId);

  const timestamp = useMemo(() => getTimeFrom(postPublished), [postPublished]);

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
    <XStack space="$2" alignItems="center">
      {showTotalScore ? (
        <XStack space="$1" alignItems="center">
          <ScoreIcon myVote={postMyVote} />
          <Text fontSize="$2" color={scoreColor}>
            {postCounts?.score}
          </Text>
        </XStack>
      ) : (
        <XStack space="$2">
          <XStack space="$1" alignItems="center">
            <ArrowUp size={14} color={upvoteColor} />
            <Text color={upvoteColor} fontSize="$2">
              {postCounts?.upvotes}
            </Text>
          </XStack>
          {downvotesAllowed && (
            <XStack space="$1" alignItems="center">
              <ArrowDown size={14} color={downvoteColor} />
              <Text color={downvoteColor} fontSize="$2">
                {postCounts?.downvotes}
              </Text>
            </XStack>
          )}
        </XStack>
      )}

      <XStack space="$1" alignItems="center">
        <MessageSquare size={14} color="$secondary" />
        <Text color="$secondary" fontSize="$2">
          {postCommentCount}
        </Text>
      </XStack>
      <XStack space="$1" alignItems="center">
        <Clock size={14} color="$secondary" />
        <Text color="$secondary" fontSize="$2">
          {timestamp}
        </Text>
      </XStack>
    </XStack>
  );
}

export default React.memo(PostMetrics);
