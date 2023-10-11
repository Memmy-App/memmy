import React from 'react';
import HStack from '@components/Common/Stack/HStack';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { ArrowDown, ArrowUp, Bookmark } from '@tamagui/lucide-icons';
import { usePostMyVote, usePostSaved } from '@src/state/post/postStore';

interface IProps {
  itemId: number;
}

export default function FeedItemActionButtons({
  itemId,
}: IProps): React.JSX.Element {
  const postMyVote = usePostMyVote(itemId);
  const postSaved = usePostSaved(itemId);

  return (
    <HStack space="$1.5" marginLeft="auto">
      <AnimatedIconButton
        icon={Bookmark}
        color={postSaved ? 'white' : '$accent'}
        iconSize={20}
        onPress={() => {}}
        backgroundColor={postSaved ? '$bookmark' : undefined}
      />
      <AnimatedIconButton
        icon={ArrowUp}
        color={postMyVote === 1 ? 'white' : '$accent'}
        iconSize={20}
        onPress={() => {}}
        backgroundColor={postMyVote === 1 ? '$upvote' : undefined}
      />
      <AnimatedIconButton
        icon={ArrowDown}
        color={postMyVote === 1 ? 'white' : '$accent'}
        iconSize={20}
        onPress={() => {}}
        backgroundColor={postMyVote === -1 ? '$downvote' : undefined}
      />
    </HStack>
  );
}
