import { IContextMenuOptions } from '@src/types';
import { PostContextMenuOption } from '@src/types/contextMenu';

interface CreatePostContextMenuOptionsParams {
  moderates: boolean;
  isOwnPost: boolean;
  isImage: boolean;
  isLink: boolean;
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
      title: 'Share Post',
      icon: 'square.and.arrow.up',
    },
  ];

  if (params.isLink && !params.isImage) {
    arr = [
      ...arr,
      {
        key: 'shareLink',
        title: 'Share Link',
        icon: 'link',
      },
    ];
  }

  if (params.isLink && params.isImage) {
    arr = [
      ...arr,
      {
        key: 'shareImage',
        title: 'Share Image',
        icon: 'photo',
      },
      {
        key: 'saveImage',
        title: 'Save Image',
        icon: 'square.and.arrow.down',
      },
    ];
  }

  arr = [
    ...arr,
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
        destructive: true,
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
