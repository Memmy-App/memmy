import { IContextMenuOptions } from '@src/types';
import { CommentContextMenuOption } from '@src/types/contextMenu';

interface CreateCommentContextMenuOptionsParams {
  moderates: boolean;
  isOwnComment: boolean;
  isSaved: boolean;
}

export const createCommentContextMenuOptions = (
  params: CreateCommentContextMenuOptionsParams,
): IContextMenuOptions<CommentContextMenuOption> => {
  let arr: IContextMenuOptions<CommentContextMenuOption> = [
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
      key: 'save',
      title: params.isSaved ? 'Unsave' : 'Save',
      icon: 'bookmark',
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

  if (!params.isOwnComment && !params.moderates) {
    arr = [
      ...arr,
      {
        key: 'report',
        title: 'Report',
        icon: 'exclamationmark.shield',
        destructive: true,
      },
    ];
  }

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
        destructive: true,
      },
    ];
  }

  if (params.moderates) {
    arr = [
      ...arr,
      {
        key: 'remove',
        title: 'Remove',
        icon: 'trash',
        destructive: true,
      },
    ];
  }

  return arr;
};
