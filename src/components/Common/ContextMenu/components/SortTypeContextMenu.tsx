import React from 'react';
import { SortType } from 'lemmy-js-client';
import { OnPressMenuItemEvent } from 'react-native-ios-context-menu';
import { IContextMenuOptions } from '@src/types';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';

interface IProps {
  children: React.ReactNode;
  selection: SortType;
  onPressMenuItem: OnPressMenuItemEvent;
}

export default function SortTypeContextMenu({
  selection,
  onPressMenuItem,
  children,
}: IProps): React.JSX.Element {
  const options: IContextMenuOptions = [
    {
      key: 'Active',
      title: 'Active',
      icon: 'bolt.badge.clock',
    },
    {
      key: 'Hot',
      title: 'Hot',
      icon: 'flame',
    },
    {
      key: 'New',
      title: 'New',
      icon: 'clock.badge',
    },
    {
      key: 'Old',
      title: 'Old',
      icon: 'clock',
    },
    {
      key: 'Top',
      title: 'Top',
      options: [
        {
          key: 'TopHour',
          title: 'Hour',
        },
        {
          key: 'TopSixHour',
          title: 'Six Hours',
        },
        {
          key: 'TopTwelveHour',
          title: 'Twelve Hours',
        },
        {
          key: 'TopDay',
          title: 'Day',
        },
        {
          key: 'TopWeek',
          title: 'Week',
        },
        {
          key: 'TopMonth',
          title: 'Month',
        },
        {
          key: 'TopYear',
          title: 'Year',
        },
        {
          key: 'TopAll',
          title: 'All',
        },
      ],
    },
    {
      key: 'MostComments',
      title: 'Most Comments',
      icon: 'arrow.up.message',
    },
    {
      key: 'NewComments',
      title: 'New Comments',
      icon: 'message.badge',
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
