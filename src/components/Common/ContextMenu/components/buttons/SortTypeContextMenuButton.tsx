import React, { useCallback, useMemo } from 'react';
import { SortType } from 'lemmy-js-client';
import SortTypeContextMenu from '@components/Common/ContextMenu/components/SortTypeContextMenu';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import ContextMenuButton from '@components/Common/ContextMenu/components/buttons/ContextMenuButton';
import { IconMap } from '@src/types/IconMap';

interface IProps {
  sortType: SortType;
  setSortType: React.Dispatch<React.SetStateAction<SortType>>;
  color?: string;
}

function SortTypeContextMenuButton({
  sortType,
  setSortType,
  color = '$accent',
}: IProps): React.JSX.Element {
  const onPress = useCallback((e: OnPressMenuItemEventObject) => {
    setSortType(e.nativeEvent.actionKey as SortType);
  }, []);

  // @ts-expect-error - TODO Fix this
  const icon = useMemo(() => IconMap[sortType], [sortType]);

  return (
    <SortTypeContextMenu selection={sortType} onPressMenuItem={onPress}>
      <ContextMenuButton icon={icon} color={color} />
    </SortTypeContextMenu>
  );
}

export default React.memo(SortTypeContextMenuButton);
