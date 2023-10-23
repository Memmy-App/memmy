import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from 'react-native-ios-context-menu';
import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { MenuConfig } from 'react-native-ios-context-menu/lib/typescript/types/MenuConfig';
import { StyleProp, ViewStyle } from 'react-native';
import { MenuElementConfig } from 'react-native-ios-context-menu/src/types/MenuConfig';
import { IContextMenuOption } from '@src/types';

interface AppContextMenuButtonProps<S = string> extends PropsWithChildren {
  options: IContextMenuOption[];
  selection?: S;
  title?: string;
  isPrimaryAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
  onLayout?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function AppContextMenuButton<S = string>(
  props: AppContextMenuButtonProps<S>,
): React.JSX.Element {
  const {
    children,
    selection,
    title = '',
    options,
    isPrimaryAction = true,
    style,
    onPressMenuItem,
    onLayout,
  } = props;

  const transformOption = useCallback(
    (option: IContextMenuOption): MenuElementConfig => {
      if (option.options != null) {
        return {
          type: 'menu',
          menuOptions: option.inline === true ? ['displayInline'] : [],
          menuTitle: option.title,
          icon: {
            type: 'IMAGE_SYSTEM',
            imageValue: {
              systemName: option.icon ?? '',
            },
          },
          menuItems: [...option.options.map(transformOption)],
        };
      }
      return {
        actionKey: option.key,
        actionTitle: option.title,
        actionSubtitle: option.subtitle,
        menuState: selection === option.key ? 'on' : 'off',
        menuAttributes: option.destructive === true ? ['destructive'] : [],
        icon: {
          type: 'IMAGE_SYSTEM',
          imageValue: {
            // @ts-expect-error - icon is optional idk
            systemName: option.icon,
          },
        },
      };
    },
    [selection],
  );

  const menuConfig = useMemo<MenuConfig>(
    () => ({
      menuTitle: title,
      menuItems: [...options.map(transformOption)],
    }),
    [options, title, transformOption],
  );

  return (
    <ContextMenuButton
      isMenuPrimaryAction={isPrimaryAction}
      menuConfig={menuConfig}
      style={style}
      onPressMenuItem={onPressMenuItem}
      onLayout={onLayout}
      hitSlop={{
        top: 30,
        right: 30,
        left: 30,
        bottom: 30,
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
