import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";

interface IProps {
  children: React.ReactNode;
  onPress: OnPressMenuItemEvent;
  isShortPress: boolean;
  options: Record<string, string>;
}

export function CommentContextMenu({
  children,
  onPress,
  isShortPress,
  options,
}: IProps) {
  const optionsArr = Object.values(options);

  return (
    <ContextMenuButton
      isMenuPrimaryAction={isShortPress}
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...optionsArr.map((option) => ({
            actionKey: option,
            actionTitle: option,
          })),
        ],
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
