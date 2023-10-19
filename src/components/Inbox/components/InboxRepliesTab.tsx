import React, { useEffect, useRef } from 'react';
import { useInboxReplies } from '@components/Inbox/hooks/useInboxReplies';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommentView } from 'lemmy-js-client';
import Comment from '@components/Comment/components/Comment';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';

interface IProps {
  selected: number;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<CommentView>): React.JSX.Element => {
  return <Comment itemId={item.comment.id} space />;
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
