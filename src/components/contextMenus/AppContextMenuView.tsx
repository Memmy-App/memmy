import {
  ContextMenuView,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { MenuConfig } from "react-native-ios-context-menu/lib/typescript/types/MenuConfig";
import { StyleProp, ViewStyle } from "react-native";
import { MenuElementConfig } from "react-native-ios-context-menu/src/types/MenuConfig";
import { ContextMenuOption } from "@src/types/ContextMenuOptions";

interface AppContextMenuViewProps extends PropsWithChildren {
  options: ContextMenuOption[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
}

export function AppContextMenuView(
  props: AppContextMenuViewProps
): React.JSX.Element {
  const { children, title = "", options, style, onPressMenuItem } = props;

  const transformOption = useCallback(
    (option: ContextMenuOption): MenuElementConfig => {
      if (option.options) {
        return {
          type: "menu",
          menuOptions: option.inline ? ["displayInline"] : [],
          menuTitle: option.title,
          icon: {
            type: "IMAGE_SYSTEM",
            imageValue: {
              systemName: option.icon ?? "",
            },
          },
          menuItems: [...option.options.map(transformOption)],
        };
      }
      return {
        actionKey: option.key,
        actionTitle: option.title,
        actionSubtitle: option.subtitle,
        menuAttributes: option.destructive ? ["destructive"] : [],
        icon: {
          type: "IMAGE_SYSTEM",
          imageValue: {
            systemName: option.icon ?? "",
          },
        },
      };
    },
    []
  );

  const menuConfig = useMemo<MenuConfig>(
    () => ({
      menuTitle: title,
      menuItems: [...options.map(transformOption)],
    }),
    [options, title, transformOption]
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
