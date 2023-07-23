import { SortType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { useFeedSortOptions } from "../../../hooks/sortOptions/useSortOptions";
import AppContextMenuButton from "./AppContextMenuButton";

interface IProps extends PropsWithChildren {
  currentSelection: SortType;
  onPress: OnPressMenuItemEvent;
}

export function FeedSortContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps) {
  const feedSortOptions = useFeedSortOptions();

  return (
    <AppContextMenuButton<SortType>
      options={feedSortOptions}
      currentSelection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
