import React, { useCallback, useMemo } from 'react';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { useInboxReplyContextMenu } from '@components/Common/ContextMenu/hooks/useInboxReplyContextMenu';
import { createInboxReplyMenuOptions } from '@helpers/contextMenu/createInboxReplyMenuOptions';

interface IProps {
  itemId: number;
  commentId: number;
  type: 'reply' | 'mention';
  children: React.ReactNode;
}

export default function InboxReplyContextMenu({
  itemId,
  commentId,
  type,
  children,
}: IProps): React.JSX.Element {
  const inboxReplyContextMenu = useInboxReplyContextMenu(
    itemId,
    commentId,
    type,
  );

  const options = useMemo(() => createInboxReplyMenuOptions(), [itemId]);

  const onItemPress = useCallback(
    (e: OnPressMenuItemEventObject): void => {
      switch (e.nativeEvent.actionKey) {
        case 'read':
          inboxReplyContextMenu.read();
          break;
        case 'reply':
          inboxReplyContextMenu.reply();
          break;
        case 'upvote':
          inboxReplyContextMenu.upvote();
          break;
        case 'downvote':
          inboxReplyContextMenu.downvote();
          break;
        case 'report':
          inboxReplyContextMenu.report();
          break;
      }
    },
    [inboxReplyContextMenu],
  );

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onItemPress}>
      {children}
    </AppContextMenuButton>
  );
}
