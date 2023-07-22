import { SortType } from "lemmy-js-client";
import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import {
  feedSortOptions,
  sortTopOptions,
} from "../../../constants/SortOptions";

interface IProps {
  children: React.ReactNode;
  currentSelection: SortType;
  onPress: OnPressMenuItemEvent;
}

export function FeedSortContextMenu({
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
          ...Object.entries(feedSortOptions).map(([key, value]) => {
            if (key === "TopAll") {
              return {
                menuTitle: value.display,
                icon: {
                  type: "IMAGE_SYSTEM",
                  imageValue: {
                    systemName: value.icon,
                  },
                },
                menuState: currentSelection === key ? "on" : "off",
                menuItems: [
                  ...Object.entries(sortTopOptions).map(
                    ([sortTopKey, sortTopValue]) => ({
                      actionKey: sortTopKey,
                      actionTitle: sortTopValue.display,
                      menuState: currentSelection === sortTopKey ? "on" : "off",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: sortTopValue.icon,
                        },
                      },
                    })
                  ),
                ],
              };
            }
            return {
              actionKey: key,
              actionTitle: value.display,
              menuState: currentSelection === key ? "on" : "off",
              icon: {
                type: "IMAGE_SYSTEM",
                imageValue: {
                  systemName: value.icon,
                },
              },
            };
          }),
        ],
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
