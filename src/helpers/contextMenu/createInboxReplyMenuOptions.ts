import { IContextMenuOptions } from '@src/types';
import { InboxReplyContextMenuOption } from '@src/types/contextMenu/InboxReplyContextMenuOption';

export const createInboxReplyMenuOptions =
  (): IContextMenuOptions<InboxReplyContextMenuOption> => {
    const arr: IContextMenuOptions<InboxReplyContextMenuOption> = [
      {
        key: 'read',
        title: 'Mark as Read',
        icon: 'envelope.open',
      },
      {
        key: 'reply',
        title: 'Reply',
        icon: 'arrowshape.turn.up.left',
      },
      {
        key: 'share',
        title: 'Share',
        icon: 'square.and.arrow.up',
      },
      {
        key: 'upvote',
        title: 'Upvote',
        icon: 'arrow.up',
      },
      {
        key: 'downvote',
        title: 'Downvote',
        icon: 'arrow.down',
      },
    ];

    return arr;
  };
