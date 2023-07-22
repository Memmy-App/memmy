import React from "react";
import {
  ContextMenuButton,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import SFIcon from "../../../common/icons/SFIcon";

export function FeedOverflowButton() {
  const { compactView } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const onPress = (e: OnPressMenuItemEventObject) => {
    const key = e.nativeEvent.actionKey;

    if (key === "large" || key === "compact") {
      dispatch(setSetting({ compactView: !compactView }));
    }
  };

  return (
    <ContextMenuButton
      style={{
        paddingRight: 10,
      }}
      isMenuPrimaryAction
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          {
            menuTitle: "Post Size",
            actionKey: "size",
            actionTitle: "Post Size",
            menuItems: [
              {
                actionKey: "compact",
                actionTitle: "Compact",
                menuState: compactView ? "on" : "off",
                icon: {
                  type: "IMAGE_SYSTEM",
                  imageValue: {
                    systemName: "list.bullet",
                  },
                },
              },
              {
                actionKey: "large",
                actionTitle: "Large",
                menuState: !compactView ? "on" : "off",
                icon: {
                  type: "IMAGE_SYSTEM",
                  imageValue: {
                    systemName: "list.bullet.below.rectangle",
                  },
                },
              },
            ],
          },
        ],
      }}
    >
      <SFIcon icon="ellipsis" />
    </ContextMenuButton>
  );
}
