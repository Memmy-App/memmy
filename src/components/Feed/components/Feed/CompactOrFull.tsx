import React from 'react';
import { useSettingsStore } from '@src/state';
import CompactFeedItem from '@components/Feed/components/Feed/CompactFeedItem';
import FeedItem from '@components/Feed/components/Feed/FeedItem';

interface IProps {
  itemId: number;
}

function CompactOrFull({ itemId }: IProps): React.JSX.Element {
  const viewType = useSettingsStore((state) => state.viewType);

  if (viewType === 'compact') {
    return <CompactFeedItem itemId={itemId} />;
  }

  return <FeedItem itemId={itemId} />;
}

export default React.memo(CompactOrFull);
