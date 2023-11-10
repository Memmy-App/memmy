import React from 'react';
import { useCompactShowFullTitle, usePostRead, usePostTitle } from '@src/state';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function CompactFeedItemTitle({ itemId }: IProps): React.JSX.Element {
  const showFullTitle = useCompactShowFullTitle();

  const postTitle = usePostTitle(itemId);
  const postRead = usePostRead(itemId);

  return (
    <Text
      fontSize="$3"
      fontWeight="bold"
      numberOfLines={showFullTitle ? undefined : 2}
      textBreakStrategy="simple"
      color={postRead ? '$secondary' : '$color'}
    >
      {postTitle}
    </Text>
  );
}

export default React.memo(CompactFeedItemTitle);
