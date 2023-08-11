import { SortType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";
import { useFeedSort } from "@src/state/feed/feedStore";
import { useFeedSortOptions } from "@src/components/contextMenus/feed/useFeedSortOptions";

interface IProps extends PropsWithChildren {
  currentSelection: SortType;
  onPress: OnPressMenuItemEvent;
}

export function FeedSortContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps): React.JSX.Element {
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
