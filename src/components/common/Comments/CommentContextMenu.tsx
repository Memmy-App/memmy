import React from "react";
import {
  ContextMenuButton,
  ContextMenuView,
  MenuElementConfig,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import { ContextMenuOptions } from "../../../types/ContextMenuOptions";

interface IProps {
  children: React.ReactNode;
  onPress: OnPressMenuItemEvent;
  isButton: boolean;
  options: ContextMenuOptions;
}

export function CommentContextMenu({
  children,
  onPress,
  isButton = false,
  options,
}: IProps) {
  // @ts-expect-error Types for menuItems are wrong for this library
  const menuItems: MenuElementConfig[] = [
    ...Object.entries(options).map(([key, value]) => ({
      actionKey: key,
      actionTitle: value.display,
      ...(value.destructive ? { menuAttributes: ["destructive"] } : {}),
      icon: {
        type: "IMAGE_SYSTEM",
        imageValue: {
          systemName: value.icon,
        },
      },
    })),
  ];

  if (isButton) {
    return (
      <ContextMenuButton
        isMenuPrimaryAction
        onPressMenuItem={onPress}
        menuConfig={{
          menuTitle: "",
          menuItems,
        }}
      >
        {children}
      </ContextMenuButton>
    );
  }

  return (
    <ContextMenuView
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        menuItems,
      }}
    >
      {children}
    </ContextMenuView>
  );
}
