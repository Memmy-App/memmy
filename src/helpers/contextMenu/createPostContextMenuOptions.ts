import { IContextMenuOptions } from '@src/types';
import { PostContextMenuOption } from '@src/types/contextMenu';

interface CreatePostContextMenuOptionsParams {
  moderates: boolean;
  isOwnPost: boolean;
}

export const createPostContextMenuOptions = (
  params: CreatePostContextMenuOptionsParams,
): IContextMenuOptions<PostContextMenuOption> => {
  let arr: IContextMenuOptions<PostContextMenuOption> = [
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

  if (!params.isOwnPost && !params.moderates) {
    arr = [
      ...arr,
      {
        key: 'report',
        title: 'Report',
        icon: 'exclamationmark.shield',
      },
    ];
  }

  if (params.isOwnPost) {
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
