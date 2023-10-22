import React from 'react';
import { Text } from 'tamagui';
import { usePostRead, usePostTitle } from '@src/state';

interface IProps {
  itemId: number;
}

function FeedItemTitle({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);
  const postRead = usePostRead(itemId);

  return (
    <Text
      fontSize="$5"
      fontWeight="bold"
      color={postRead ? '$secondary' : '$color'}
    >
      {postTitle}
    </Text>
  );
}

export default React.memo(FeedItemTitle);
