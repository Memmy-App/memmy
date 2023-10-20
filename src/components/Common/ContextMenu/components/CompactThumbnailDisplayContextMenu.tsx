import React from 'react';
import { OnPressMenuItemEvent } from 'react-native-ios-context-menu';
import { IContextMenuOptions } from '@src/types';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';

interface IProps {
  children: React.ReactNode;
  selection: 'left' | 'right' | 'none';
  onPressMenuItem: OnPressMenuItemEvent;
}

export default function CompactThumbnailDisplayContextMenu({
  selection,
  onPressMenuItem,
  children,
}: IProps): React.JSX.Element {
  const options: IContextMenuOptions = [
    {
      key: 'left',
      title: 'Left',
    },
    {
      key: 'right',
      title: 'Right',
    },
    {
      key: 'none',
      title: 'None',
    },
  ];

  return (
    <AppContextMenuButton
      selection={selection}
      options={options}
      onPressMenuItem={onPressMenuItem}
    >
      {children}
    </AppContextMenuButton>
  );
}
