import { CommentSortType } from "lemmy-js-client";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import { commentSortOptions } from "../../../types/SortOptions";

interface IProps {
  children: React.ReactNode;
  currentSelection: CommentSortType;
  onPress: OnPressMenuItemEvent;
}

export function CommentSortContextMenu({
  children,
  currentSelection,
  onPress,
}: IProps) {
  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...Object.entries(commentSortOptions).map(([key, value]) => ({
            actionKey: key,
            actionTitle: value.display,
            menuState: currentSelection === key ? "on" : "off",
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: value.icon,
              },
            },
          })),
        ],
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
