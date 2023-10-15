import { IContextMenuOptions } from '@src/types';
import { CommentContextMenuOption } from '@src/types/contextMenu';

interface CreateCommentContextMenuOptionsParams {
  isModerator: boolean;
  isOwnComment: boolean;
}

export const createCommentContextMenuOptions = (
  params: CreateCommentContextMenuOptionsParams,
): IContextMenuOptions<CommentContextMenuOption> => {
  let arr: IContextMenuOptions<CommentContextMenuOption> = [
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

  if (params.isOwnComment) {
    arr = [
      ...arr,
      {
        key: 'edit',
        title: 'Edit',
        icon: 'pencil',
      },
      {
        key: 'delete',
        title: 'Delete',
        icon: 'trash',
      },
    ];
  }

  if (params.isModerator) {
    arr = [
      ...arr,
      {
        key: 'remove',
        title: 'Remove',
        icon: 'trash',
      },
    ];
  }

  return arr;
};
