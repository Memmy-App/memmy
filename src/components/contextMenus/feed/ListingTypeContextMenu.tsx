import { ListingType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { useListingTypeOptions } from "@src/components/contextMenus/feed/useListingTypeOptions";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";

interface IProps extends PropsWithChildren {
  currentSelection: ListingType;
  onPress: OnPressMenuItemEvent;
}

export function ListingTypeContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps): React.JSX.Element {
  const listingTypeOptions = useListingTypeOptions();

  return (
    <AppContextMenuButton<ListingType>
      options={listingTypeOptions}
      selection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
