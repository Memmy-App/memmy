import React from 'react';
import {
  useCommentDownvotes,
  useCommentMyVote,
  useCommentScore,
  useCommentUpvotes,
} from '@src/state/comment/commentStore';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Text } from 'tamagui';
import ScoreIcon from '@components/Common/Icons/ScoreIcon';
import VoteIcon from '@components/Common/Icons/VoteIcon';

interface IProps {
  itemId: number;
}

function CommentMetrics({ itemId }: IProps): React.JSX.Element {
  const commentUpvotes = useCommentUpvotes(itemId);
  const commentDownvotes = useCommentDownvotes(itemId);
  const commentScore = useCommentScore(itemId);

  const commentMyVote = useCommentMyVote(itemId);

  const totalScore = useSettingsStore((state) => state.totalScore);

  if (totalScore) {
    return (
      <HStack space="$1">
        <ScoreIcon myVote={commentMyVote} />
        <Text color="$secondary">{commentScore}</Text>
      </HStack>
    );
  } else {
    return (
      <HStack space="$2">
        <HStack space="$1">
          <VoteIcon myVote={commentMyVote} type="up" />
          <Text color="$secondary">{commentUpvotes}</Text>
        </HStack>
        <HStack space="$1">
          <VoteIcon myVote={commentMyVote} type="down" />
          <Text color="$secondary">{commentDownvotes}</Text>
        </HStack>
      </HStack>
    );
  }
}

export default React.memo(CommentMetrics);
