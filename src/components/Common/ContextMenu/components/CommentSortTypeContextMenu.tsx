import React from 'react';
import { CommentSortType } from 'lemmy-js-client';
import { OnPressMenuItemEvent } from 'react-native-ios-context-menu';
import { IContextMenuOptions } from '@src/types';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';

interface IProps {
  children: React.ReactNode;
  selection: CommentSortType;
  onPressMenuItem: OnPressMenuItemEvent;
}

export default function CommentSortTypeContextMenu({
  selection,
  onPressMenuItem,
  children,
}: IProps): React.JSX.Element {
  const options: IContextMenuOptions = [
    {
      key: 'Hot',
      title: 'Hot',
      icon: 'flame',
    },
    {
      key: 'Top',
      title: 'Top',
      icon: 'arrow.up',
    },
    {
      key: 'New',
      title: 'bolt.badge.clock.fill',
    },
    {
      key: 'Old',
      title: 'clock',
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
