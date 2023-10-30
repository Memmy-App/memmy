import React, { useCallback, useMemo } from 'react';
import { CommentSortType } from 'lemmy-js-client';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import CommentSortTypeContextMenu from '@components/Common/ContextMenu/components/CommentSortTypeContextMenu';
import ContextMenuButton from '@components/Common/ContextMenu/components/buttons/ContextMenuButton';
import { IconMap } from '@src/types/IconMap';

interface IProps {
  sortType: CommentSortType;
  setSortType: React.Dispatch<React.SetStateAction<CommentSortType>>;
}

function CommentSortTypeContextMenuButton({
  sortType,
  setSortType,
}: IProps): React.JSX.Element {
  const onPress = useCallback((e: OnPressMenuItemEventObject) => {
    setSortType(e.nativeEvent.actionKey as CommentSortType);
  }, []);

  const icon = useMemo(() => IconMap[sortType], [sortType]);

  return (
    <CommentSortTypeContextMenu selection={sortType} onPressMenuItem={onPress}>
      <ContextMenuButton icon={icon} />
    </CommentSortTypeContextMenu>
  );
}

export default React.memo(CommentSortTypeContextMenuButton);
