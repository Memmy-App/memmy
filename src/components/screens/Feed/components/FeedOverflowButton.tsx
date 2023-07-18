import React from "react";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import SFIcon from "../../../common/icons/SFIcon";

export function FeedOverflowButton() {
  const { compactView } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  return (
    <ContextMenuButton
      style={{
        paddingRight: 10,
      }}
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        if (
          nativeEvent.actionKey === "large" ||
          nativeEvent.actionKey === "compact"
        ) {
          dispatch(setSetting({ compactView: !compactView }));
        }
      }}
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
