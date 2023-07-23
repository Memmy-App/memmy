import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { MenuConfig } from "react-native-ios-context-menu/lib/typescript/types/MenuConfig";
import { StyleProp, ViewStyle } from "react-native";
import { MenuActionConfig } from "react-native-ios-context-menu/src/types/MenuConfig";
import { ContextMenuOption } from "../../../types/ContextMenuOptions";

interface AppContextMenuButtonProps<CS = string> extends PropsWithChildren {
  options: ContextMenuOption[];
  currentSelection?: CS;
  title?: string;
  isPrimaryAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
}

function AppContextMenuButton<CS = string>(
  props: AppContextMenuButtonProps<CS>
) {
  const {
    children,
    currentSelection,
    title = "",
    options,
    isPrimaryAction = true,
    style,
    onPressMenuItem,
  } = props;

  const optionToAction = useCallback(
    (option: ContextMenuOption): MenuActionConfig => ({
      actionKey: option.key,
      actionTitle: option.title,
      actionSubtitle: option.subtitle,
      menuState: currentSelection === option.key ? "on" : "off",
      menuAttributes: option.destructive ? ["destructive"] : [],
      icon: {
        type: "IMAGE_SYSTEM",
        imageValue: {
          systemName: option.icon,
        },
      },
    }),
    [currentSelection]
  );

  const menuConfig = useMemo<MenuConfig>(
    () => ({
      menuTitle: title,
      // @ts-ignore Types for menuItems are wrong for this library
      menuItems: [
        ...options.map((rootOption) => {
          if (rootOption.options && rootOption.options.length > 0) {
            return {
              type: "menu",
              menuOptions: rootOption.inline ? ["displayInline"] : [],
              menuTitle: rootOption.title,
              menuAttributes: rootOption.destructive ? ["destructive"] : [],
              icon: {
                type: "IMAGE_SYSTEM",
                imageValue: {
                  systemName: rootOption.icon,
                },
              },
              menuItems: [
                ...rootOption.options.map((option) => optionToAction(option)),
              ],
            };
          }
          return optionToAction(rootOption);
        }),
      ],
    }),
    [options, currentSelection, title, optionToAction]
  );

  return (
    <ContextMenuButton
      isMenuPrimaryAction={isPrimaryAction}
      menuConfig={menuConfig}
      style={style}
      onPressMenuItem={onPressMenuItem}
    >
      {children}
    </ContextMenuButton>
  );
}

export default AppContextMenuButton;
