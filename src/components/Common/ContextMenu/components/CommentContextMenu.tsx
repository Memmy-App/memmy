import React, { useCallback, useMemo } from 'react';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { createCommentContextMenuOptions } from '@helpers/contextMenu';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { useCommentContextMenu } from '@hooks/comments';
import {
  useCommentIsOwnComment,
  useCommentModerates,
  useCommentSaved,
} from '@src/state';

interface IProps {
  itemId: number;
  children: React.ReactNode;
}

export default function CommentContextMenu({
  itemId,
  children,
}: IProps): React.JSX.Element {
  const commentContextMenu = useCommentContextMenu(itemId);
  const moderates = useCommentModerates(itemId);
  const isOwn = useCommentIsOwnComment(itemId);
  const isSaved = useCommentSaved(itemId);

  const options = useMemo(
    () =>
      createCommentContextMenuOptions({
        moderates,
        isOwnComment: isOwn,
        isSaved,
      }),
    [itemId, isSaved, isOwn],
  );

  const onItemPress = useCallback(
    (e: OnPressMenuItemEventObject): void => {
      switch (e.nativeEvent.actionKey) {
        case 'reply':
          commentContextMenu.reply();
          break;
        case 'upvote':
          commentContextMenu.upvote();
          break;
        case 'downvote':
          commentContextMenu.downvote();
          break;
        case 'delete':
          commentContextMenu.delet();
          break;
        case 'remove':
          commentContextMenu.remove();
          break;
        case 'edit':
          commentContextMenu.edit();
          break;
        case 'share':
          commentContextMenu.share();
          break;
        case 'save':
          commentContextMenu.save();
          break;
      }
    },
    [commentContextMenu],
  );

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onItemPress}>
      {children}
    </AppContextMenuButton>
  );
}
