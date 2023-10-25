import React, { useCallback, useMemo } from 'react';
import { useCommentMyVote } from '@src/state';
import instance from '@src/Instance';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
  type: 'upvote' | 'downvote';
}

function CommentVoteButton({ itemId, type }: IProps): React.JSX.Element {
  const commentMyVote = useCommentMyVote(itemId);

  const icon = useMemo(
    () => (type === 'upvote' ? ArrowUp : ArrowDown),
    [itemId, type],
  );

  const color = useMemo(() => {
    if (
      (type === 'upvote' && commentMyVote === 1) ||
      (type === 'downvote' && commentMyVote === -1)
    ) {
      return 'white';
    }

    return '$accent';
  }, [itemId, type, commentMyVote]);

  const backgroundColor = useMemo(() => {
    if (type === 'upvote' && commentMyVote === 1) {
      return '$upvote';
    } else if (type === 'downvote' && commentMyVote === -1) {
      return '$downvote';
    }

    return undefined;
  }, [itemId, type, commentMyVote]);

  const doLikeComment = useCallback((): void => {
    void instance.likeComment(itemId, type === 'upvote' ? 1 : -1);
  }, [itemId, type]);

  return (
    <AnimatedIconButton
      icon={icon}
      color={color}
      backgroundColor={backgroundColor}
      onPress={doLikeComment}
      iconSize={20}
    />
  );
}

export default React.memo(CommentVoteButton);
