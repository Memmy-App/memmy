import { SortType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { useFeedSortOptions } from "../../../hooks/contextMenu/useFeedSortOptions";
import { AppContextMenuButton } from "./App/AppContextMenuButton";

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
      selection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
