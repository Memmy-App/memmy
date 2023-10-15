import React, { useCallback, useMemo } from 'react';
import { ListingType } from 'lemmy-js-client';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import ContextMenuButton from '@components/Common/ContextMenu/components/buttons/ContextMenuButton';
import { IconMap } from '@src/types/IconMap';
import ListingTypeContextMenu from '@components/Common/ContextMenu/components/ListingTypeContextMenu';

interface IProps {
  listingType: ListingType;
  setListingType: React.Dispatch<React.SetStateAction<ListingType>>;
}

function SortTypeContextMenuButton({
  listingType,
  setListingType,
}: IProps): React.JSX.Element {
  const onPress = useCallback((e: OnPressMenuItemEventObject) => {
    setListingType(e.nativeEvent.actionKey as ListingType);
  }, []);

  // @ts-expect-error - TODO Fix this
  const icon = useMemo(() => IconMap[listingType], [listingType]);

  return (
    <ListingTypeContextMenu selection={listingType} onPressMenuItem={onPress}>
      <ContextMenuButton icon={icon} />
    </ListingTypeContextMenu>
  );
}

export default React.memo(SortTypeContextMenuButton);
