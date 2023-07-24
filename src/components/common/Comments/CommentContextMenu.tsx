import React from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { ContextMenuOptions } from "../../../types/ContextMenuOptions";
import { AppContextMenuButton } from "../ContextMenu/App/AppContextMenuButton";
import { AppContextMenuView } from "../ContextMenu/App/AppContextMenuView";

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
  if (isButton) {
    return (
      <AppContextMenuButton options={options} onPressMenuItem={onPress}>
        {children}
      </AppContextMenuButton>
    );
  }

  return (
    <AppContextMenuView options={options} onPressMenuItem={onPress}>
      {children}
    </AppContextMenuView>
  );
}
