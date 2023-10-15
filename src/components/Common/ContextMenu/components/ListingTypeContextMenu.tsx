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
      icon: 'globe',
    },
    {
      key: 'Subscribed',
      title: 'Subscribed',
      icon: 'heart',
    },
    {
      key: 'Local',
      title: 'Local',
      icon: 'square.and.arrow.down',
    },
    {
      key: 'Moderated',
      title: 'Moderated',
      icon: 'shield',
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
