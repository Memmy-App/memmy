import React from 'react';
import { createCommunityContextMenuOptions } from '@helpers/contextMenu/createCommunityContextMenuOptions';
import { useCommunityBlocked } from '@src/state';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { useCommunityContextMenu } from '@components/Common/ContextMenu/hooks/useCommunityContextMenu';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { CommunityContextMenuOption } from '@src/types/contextMenu/CommunityContextMenuOption';

interface IProps {
  itemId: number;
  children: React.ReactNode;
}

export default function CommunityContextMenu({
  itemId,
  children,
}: IProps): React.JSX.Element {
  const contextMenu = useCommunityContextMenu(itemId);

  const communityBlocked = useCommunityBlocked(itemId);

  const options = createCommunityContextMenuOptions({
    blocked: communityBlocked,
    moderates: false,
  });

  const onPressMenuItem = (e: OnPressMenuItemEventObject): void => {
    switch (e.nativeEvent.actionKey as CommunityContextMenuOption) {
      case 'block': {
        contextMenu.block();
        break;
      }
      case 'modlog': {
        contextMenu.modLog();
        break;
      }
      case 'moderators': {
        contextMenu.moderators();
        break;
      }
      case 'info': {
        contextMenu.info();
        break;
      }
    }
  };

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onPressMenuItem}>
      {children}
    </AppContextMenuButton>
  );
}
