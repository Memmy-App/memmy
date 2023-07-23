import { CommentSortType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { useCommentSortOptions } from "../../../hooks/sortOptions/useSortOptions";
import AppContextMenuButton from "./AppContextMenuButton";

interface IProps extends PropsWithChildren {
  currentSelection: CommentSortType;
  onPress: OnPressMenuItemEvent;
}

export function CommentSortContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps) {
  const commentSortOptions = useCommentSortOptions();

  return (
    <AppContextMenuButton<CommentSortType>
      options={commentSortOptions}
      currentSelection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
