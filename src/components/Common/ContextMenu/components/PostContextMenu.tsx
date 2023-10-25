import React, { useCallback, useMemo } from 'react';
import { usePostContextMenu } from '@components/Common/ContextMenu/hooks';
import { usePostIsOwn, usePostLinkType, usePostModerates } from '@src/state';
import { createPostContextMenuOptions } from '@helpers/contextMenu/createPostContextMenuOptions';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';

interface IProps {
  itemId: number;
  children: React.ReactNode;
}

export default function PostContextMenu({
  itemId,
  children,
}: IProps): React.JSX.Element {
  const postContextMenu = usePostContextMenu(itemId);

  const postLinkType = usePostLinkType(itemId);
  const moderates = usePostModerates(itemId);
  const isOwn = usePostIsOwn(itemId);

  const options = useMemo(
    () =>
      createPostContextMenuOptions({
        moderates,
        isOwnPost: isOwn,
        isLink: postLinkType !== 'none',
        isImage: postLinkType === 'image',
      }),
    [itemId],
  );

  const onItemPress = useCallback(
    (e: OnPressMenuItemEventObject): void => {
      switch (e.nativeEvent.actionKey) {
        case 'reply':
          postContextMenu.reply();
          break;
        case 'upvote':
          postContextMenu.upvote();
          break;
        case 'downvote':
          postContextMenu.downvote();
          break;
        case 'delete':
          postContextMenu.delet();
          break;
        case 'remove':
          postContextMenu.remove();
          break;
        case 'edit':
          postContextMenu.edit();
          break;
        case 'report':
          postContextMenu.report();
          break;
        case 'share':
          postContextMenu.share();
          break;
        case 'shareLink':
          postContextMenu.shareUrl(false);
          break;
        case 'shareImage':
          postContextMenu.shareUrl(true);
          break;
        case 'saveImage':
          postContextMenu.savePostImage();
          break;
      }
    },
    [postContextMenu],
  );

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onItemPress}>
      {children}
    </AppContextMenuButton>
  );
}
