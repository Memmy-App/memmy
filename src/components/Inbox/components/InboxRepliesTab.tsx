import React, { useEffect, useRef } from 'react';
import { useInboxReplies } from '@components/Inbox/hooks/useInboxReplies';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommentView } from 'lemmy-js-client';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import InboxComment from '@components/Inbox/components/InboxComment';

interface IProps {
  selected: number;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<CommentView>): React.JSX.Element => {
  return <InboxComment itemId={item.comment.id} />;
};

const keyExtractor = (item: CommentView): string => item.comment.id.toString();

function InboxRepliesTab({ selected }: IProps): React.JSX.Element | null {
  const inboxReplies = useInboxReplies();

  const initialized = useRef(false);

  // Lazy loading
  useEffect(() => {
    if (selected === 0 && !initialized.current) {
      inboxReplies.doLoad();
      initialized.current = true;
    }
  }, [selected]);

  return (
    <FlashList<CommentView>
      renderItem={renderItem}
      data={inboxReplies.data}
      keyExtractor={keyExtractor}
      estimatedItemSize={150}
      ListFooterComponent={
        <FeedLoadingIndicator
          loading={inboxReplies.isLoading}
          error={inboxReplies.isError}
          empty={inboxReplies.isEmpty}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

export default React.memo(InboxRepliesTab);
