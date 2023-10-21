import React, { useCallback, useEffect, useRef } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import InboxComment from '@components/Inbox/components/InboxComment';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { useReplies } from '@src/state';

interface IProps {
  selected: number;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <InboxComment itemId={item} />;
};

const keyExtractor = (item: number): string => item.toString();

function InboxRepliesTab({ selected }: IProps): React.JSX.Element | null {
  const initialized = useRef(false);

  const replies = useReplies();

  const { isLoading, isError, refresh: load } = useLoadData();

  // Lazy loading
  useEffect(() => {
    if (selected !== 0) return;

    if (!initialized.current) {
      doLoad();
      initialized.current = true;
    }
  }, [selected]);

  const doLoad = useCallback(() => {
    load(async () => {
      await instance.getReplies();
    });
  }, []);

  return (
    <FlashList<number>
      renderItem={renderItem}
      data={replies}
      keyExtractor={keyExtractor}
      estimatedItemSize={150}
      ListFooterComponent={
        <FeedLoadingIndicator
          loading={isLoading}
          error={isError}
          empty={replies.length < 1}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

export default React.memo(InboxRepliesTab);
