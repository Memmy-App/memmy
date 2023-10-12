import React, { useCallback } from 'react';
import instance from '@api/Instance';
import { usePostMyVote } from '@src/state/post/postStore';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { ArrowDown } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function PostDownvoteButton({ itemId }: IProps): React.JSX.Element {
  const postMyVote = usePostMyVote(itemId);

  const doDislikePost = useCallback((): void => {
    if (postMyVote === 0 || postMyVote === undefined)
      void instance.likePost(itemId, -1);
    else void instance.likePost(itemId, 0);
  }, [itemId, postMyVote]);

  return (
    <AnimatedIconButton
      icon={ArrowDown}
      color={postMyVote === 1 ? 'white' : '$accent'}
      iconSize={25}
      onPress={doDislikePost}
      backgroundColor={postMyVote === -1 ? '$downvote' : undefined}
    />
  );
}

export default React.memo(PostDownvoteButton);
