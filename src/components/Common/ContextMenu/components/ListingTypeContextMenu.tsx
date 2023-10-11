import React from 'react';
import { ListingType } from 'lemmy-js-client';
import { OnPressMenuItemEvent } from 'react-native-ios-context-menu';
import { IContextMenuOptions } from '@src/types';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';

interface IProps {
  children: React.ReactNode;
  selection: ListingType;
  onPressMenuItem: OnPressMenuItemEvent;
}

export default function ListingTypeContextMenu({
  selection,
  onPressMenuItem,
  children,
}: IProps): React.JSX.Element {
  const options: IContextMenuOptions = [
    {
      key: 'All',
      title: 'All',
    },
    {
      key: 'Subscribed',
      title: 'Subscribed',
    },
    {
      key: 'Local',
      title: 'Local',
    },
    {
      key: 'Moderated',
      title: 'Moderated',
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
