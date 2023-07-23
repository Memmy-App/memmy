import {
  ContextMenuView,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { MenuConfig } from "react-native-ios-context-menu/lib/typescript/types/MenuConfig";
import { StyleProp, ViewStyle } from "react-native";
import { MenuActionConfig } from "react-native-ios-context-menu/src/types/MenuConfig";
import { ContextMenuOption } from "../../../types/ContextMenuOptions";

interface AppContextMenuViewProps extends PropsWithChildren {
  options: ContextMenuOption[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
}

function AppContextMenuView(props: AppContextMenuViewProps) {
  const { children, title = "", options, style, onPressMenuItem } = props;

  const optionToAction = useCallback(
    (option: ContextMenuOption): MenuActionConfig => ({
      actionKey: option.key,
      actionTitle: option.title,
      actionSubtitle: option.subtitle,
      icon: {
        type: "IMAGE_SYSTEM",
        imageValue: {
          systemName: option.icon,
        },
      },
    }),
    []
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
    [options, title, optionToAction]
  );

  return (
    <ContextMenuView
      menuConfig={menuConfig}
      style={style}
      onPressMenuItem={onPressMenuItem}
    >
      {children}
    </ContextMenuView>
  );
}

export default AppContextMenuView;
