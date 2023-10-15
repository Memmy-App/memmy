import React, { useCallback, useMemo } from 'react';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { createCommentContextMenuOptions } from '@helpers/contextMenu';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { useCommentContextMenu } from '@hooks/comments';

interface IProps {
  itemId: number;
  children: React.ReactNode;
}

export default function CommentContextMenu({
  itemId,
  children,
}: IProps): React.JSX.Element {
  const commentContextMenu = useCommentContextMenu(itemId);

  const options = useMemo(
    () =>
      createCommentContextMenuOptions({
        isModerator: false,
        isOwnComment: false,
      }),
    [itemId],
  );

  const onItemPress = useCallback(
    (e: OnPressMenuItemEventObject): void => {
      switch (e.nativeEvent.actionKey) {
        case 'upvote':
          commentContextMenu.upvote();
          break;
        case 'downvote':
          commentContextMenu.downvote();
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
