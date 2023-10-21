import React from 'react';
import { usePostTitle } from '@src/state';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function CompactFeedItemTitle({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);

  return (
    <Text
      fontSize="$3"
      fontWeight="bold"
      numberOfLines={2}
      textBreakStrategy="simple"
    >
      {postTitle}
    </Text>
  );
}

export default React.memo(CompactFeedItemTitle);
