import { ListingType } from "lemmy-js-client";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import { ContextMenuOptions } from "../../../types/ContextMenuOptions";

export const listingTypeOptions: ContextMenuOptions = {
  All: {
    display: "All",
    icon: "globe",
  },
  Local: {
    display: "Local",
    icon: "location",
  },
  Subscribed: {
    display: "Subscribed",
    icon: "heart",
  },
};

interface IProps {
  children: React.ReactNode;
  currentSelection: ListingType;
  onPress: OnPressMenuItemEvent;
}

export function ListingTypeContextMenu({
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
          ...Object.entries(listingTypeOptions).map(([key, value]) => ({
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
