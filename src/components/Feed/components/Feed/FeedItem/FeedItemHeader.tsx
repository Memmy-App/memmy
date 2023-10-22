import React from 'react';
import { XStack, YStack } from 'tamagui';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import PostContextButton from '@components/Post/components/PostContextButton';
import FeedItemTitle from '@components/Feed/components/Feed/FeedItem/FeedItemTitle';

interface IProps {
  itemId: number;
}

function FeedItemHeader({ itemId }: IProps): React.JSX.Element {
  return (
    <YStack px="$3" py="$1" space="$1.5">
      <XStack alignItems="center">
        <PostCommunityLabel itemId={itemId} />
        <PostContextButton itemId={itemId} />
      </XStack>
      <FeedItemTitle itemId={itemId} />
    </YStack>
  );
}

export default React.memo(FeedItemHeader);
