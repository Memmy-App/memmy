import React, { useCallback } from 'react';
import instance from '@src/Instance';
import { usePostMyVote } from '@src/state/post/postStore';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { ArrowUp } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function PostUpvoteButton({ itemId }: IProps): React.JSX.Element {
  const postMyVote = usePostMyVote(itemId);

  const doLikePost = useCallback((): void => {
    void instance.likePost(itemId, 1);
  }, [itemId]);

  return (
    <AnimatedIconButton
      icon={ArrowUp}
      color={postMyVote === 1 ? 'white' : '$accent'}
      iconSize={25}
      onPress={doLikePost}
      backgroundColor={postMyVote === 1 ? '$upvote' : undefined}
    />
  );
}

export default React.memo(PostUpvoteButton);
