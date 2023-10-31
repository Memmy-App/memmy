import React, { useCallback, useEffect } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import InboxComment from '@components/Inbox/components/InboxComment';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { useMentions } from '@src/state';

interface IProps {
  selected: number;
  unreadOnly: boolean;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<number>): React.JSX.Element => {
  return <InboxComment itemId={item} type="mention" />;
};

const keyExtractor = (item: number): string => item.toString();

function InboxMentionsTab({
  selected,
  unreadOnly,
}: IProps): React.JSX.Element | null {
  const mentions = useMentions();

  const { isLoading, isError, isRefreshing, refresh: load } = useLoadData();

  // Lazy loading
  useEffect(() => {
    if (selected !== 1) return;

    doLoad();
  }, [selected, unreadOnly]);

  const doLoad = useCallback((): void => {
    load(async () => {
      await instance.getMentions({ unreadOnly });
    });
  }, [unreadOnly]);

  return (
    <FlashList<number>
      renderItem={renderItem}
      data={mentions}
      extraData={mentions}
      keyExtractor={keyExtractor}
      estimatedItemSize={150}
      ListFooterComponent={
        <FeedLoadingIndicator
          loading={isLoading}
          error={isError}
          empty={mentions.length < 1}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={doLoad} />
      }
    />
  );
}

export default React.memo(InboxMentionsTab);
