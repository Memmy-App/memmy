import { ListingType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import AppContextMenuButton from "./AppContextMenuButton";
import { useListingTypeOptions } from "../../../hooks/sortOptions/useSortOptions";

interface IProps extends PropsWithChildren {
  currentSelection: ListingType;
  onPress: OnPressMenuItemEvent;
}

export function ListingTypeContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps) {
  const listingTypeOptions = useListingTypeOptions();

  return (
    <AppContextMenuButton<ListingType>
      options={listingTypeOptions}
      currentSelection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
