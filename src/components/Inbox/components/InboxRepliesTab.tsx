import React, { useCallback, useEffect } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import InboxComment from '@components/Inbox/components/InboxComment';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { useReplies } from '@src/state';
import RefreshControl from '@components/Common/Gui/RefreshControl';

interface IProps {
  selected: number;
  unreadOnly: boolean;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <InboxComment itemId={item} type="reply" />;
};

const keyExtractor = (item: number): string => item.toString();

function InboxRepliesTab({
  selected,
  unreadOnly,
}: IProps): React.JSX.Element | null {
  const replies = useReplies();

  const { isLoading, isError, isRefreshing, refresh: load } = useLoadData();

  useEffect(() => {
    if (selected !== 0) return;

    doLoad();
  }, [selected, unreadOnly]);

  const doLoad = useCallback((): void => {
    load(async () => {
      await instance.getReplies(unreadOnly);
    });
  }, [unreadOnly]);

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
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={doLoad} />
      }
    />
  );
}

export default React.memo(InboxRepliesTab);
