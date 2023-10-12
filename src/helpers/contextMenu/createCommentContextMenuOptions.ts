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
    },
    {
      key: 'upvote',
      title: 'Upvote',
    },
    {
      key: 'downvote',
      title: 'Downvote',
    },
  ];

  if (params.isOwnComment) {
    arr = [
      ...arr,
      {
        key: 'edit',
        title: 'Edit',
      },
      {
        key: 'delete',
        title: 'Delete',
      },
    ];
  }

  if (params.isModerator) {
    arr = [
      ...arr,
      {
        key: 'remove',
        title: 'Remove',
      },
    ];
  }

  return arr;
};
