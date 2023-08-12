import { CommentSortType } from "lemmy-js-client";
import React, { PropsWithChildren } from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";
import { useCommentSortOptions } from "@src/components/contextMenus/comments/useCommentSortOptions";

interface IProps extends PropsWithChildren {
  currentSelection: CommentSortType;
  onPress: OnPressMenuItemEvent;
}

export function CommentSortContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps): React.JSX.Element {
  const commentSortOptions = useCommentSortOptions();

  return (
    <AppContextMenuButton<CommentSortType>
      options={commentSortOptions}
      selection={currentSelection}
      onPressMenuItem={onPress}
    >
      {children}
    </AppContextMenuButton>
  );
}
