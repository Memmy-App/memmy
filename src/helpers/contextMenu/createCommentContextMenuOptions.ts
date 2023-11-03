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
      key: 'copy',
      title: 'Copy',
      icon: 'clipboard',
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
        key: 'inline',
        title: 'Reporting and Blocking',
        options: [
          {
            key: 'report',
            title: 'Report',
            icon: 'exclamationmark.shield',
            destructive: true,
          },
          {
            key: 'block',
            title: 'Block',
            icon: 'hand.raised',
            destructive: true,
          },
        ],
      },
    ];
  }

  if (params.isOwnComment) {
    arr = [
      ...arr,
      {
        key: 'inline',
        title: 'Content Tools',
        options: [
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
        ],
      },
    ];
  }

  if (params.moderates) {
    arr = [
      ...arr,
      {
        key: 'inline',
        title: 'Moderation Tools',
        options: [
          {
            key: 'remove',
            title: 'Remove',
            icon: 'trash',
            destructive: true,
          },
        ],
      },
    ];
  }

  return arr;
};
