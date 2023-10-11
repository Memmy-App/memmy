import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { ArrowDown, ArrowUp, Bookmark } from '@tamagui/lucide-icons';
import { usePostMyVote, usePostSaved } from '@src/state/post/postStore';
import instance from '@api/Instance';

interface IProps {
  itemId: number;
}

export default function FeedItemActionButtons({
  itemId,
}: IProps): React.JSX.Element {
  const postMyVote = usePostMyVote(itemId);
  const postSaved = usePostSaved(itemId);

  const doLikePost = (): void => {
    if (postMyVote === 0) void instance.likePost(itemId, 1);
    else void instance.likePost(itemId, 0);
  };

  const doDislikePost = (): void => {
    if (postMyVote === 0) void instance.likePost(itemId, -1);
    else void instance.likePost(itemId, 0);
  };

  return (
    <HStack space="$1.5" marginLeft="auto">
      <AnimatedIconButton
        icon={Bookmark}
        color={postSaved ? 'white' : '$accent'}
        iconSize={20}
        onPress={doLikePost}
        backgroundColor={postSaved ? '$bookmark' : undefined}
      />
      <AnimatedIconButton
        icon={ArrowUp}
        color={postMyVote === 1 ? 'white' : '$accent'}
        iconSize={20}
        onPress={doLikePost}
        backgroundColor={postMyVote === 1 ? '$upvote' : undefined}
      />
      <AnimatedIconButton
        icon={ArrowDown}
        color={postMyVote === 1 ? 'white' : '$accent'}
        iconSize={20}
        onPress={doDislikePost}
        backgroundColor={postMyVote === -1 ? '$downvote' : undefined}
      />
    </HStack>
  );
}
