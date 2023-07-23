import React from "react";
import {
  ContextMenuButton,
  ContextMenuView,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import { ICON_MAP } from "../../../constants/IconMap";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { UseFeedItem } from "../../../hooks/feeds/useFeedItem";
import { RootContextMenuOption } from "../../../types/ContextMenuOptions";

export const FEED_OPTIONS: Record<string, Partial<RootContextMenuOption>> = {
  Upvote: {
    title: "Upvote",
    icon: ICON_MAP.UPVOTE,
  },
  Downvote: {
    title: "Downvote",
    icon: ICON_MAP.DOWNVOTE,
  },
  Reply: {
    title: "Reply",
    icon: ICON_MAP.REPLY,
  },
  Save: {
    title: "Save",
    icon: ICON_MAP.SAVE,
  },
  Share: {
    title: "Share Post",
    icon: ICON_MAP.SHARE,
  },
  Report: {
    title: "Report Post",
    icon: ICON_MAP.REPORT_POST,
  },
  BlockUser: {
    title: "Block User",
    icon: ICON_MAP.BLOCK_USER,
    destructive: true,
  },
  // Community: {
  //   display: "Community",
  //   icon: "person.2",
  // },
};

const FEED_COMMUNITY_OPTIONS: Record<string, Partial<RootContextMenuOption>> = {
  Subscribe: {
    title: "Subscribe",
    icon: ICON_MAP.SUBSCRIBE,
  },
  BlockCommunity: {
    title: "Block",
    icon: "xmark.circle",
    destructive: true,
  },
};

const menuItemsRenderer = () => {
  const menuItems = Object.entries(FEED_OPTIONS).map(([key, value]) => {
    if (key === "Community") {
      return {
        menuTitle: "Community",
        actionKey: key,
        actionTitle: value.title,
        menuItems: [
          ...Object.entries(FEED_COMMUNITY_OPTIONS).map(
            ([commKey, commValue]) => ({
              actionKey: commKey,
              actionTitle: commValue.title,
              ...(commValue.destructive
                ? { menuAttributes: ["destructive"] }
                : {}),
              icon: {
                type: "IMAGE_SYSTEM",
                imageValue: {
                  systemName: commValue.icon,
                },
              },
            })
          ),
        ],
      };
    }
    return {
      actionKey: key,
      actionTitle: value.title,
      ...(value.destructive ? { menuAttributes: ["destructive"] } : {}),
      icon: {
        type: "IMAGE_SYSTEM",
        imageValue: {
          systemName: value.icon,
        },
      },
    };
  });

  return menuItems;
};

interface IProps {
  children: React.ReactNode;
  feedItem: UseFeedItem;
}

export function FeedItemContextMenu({
  children,
  feedItem,
  isButton = false,
}: IProps & { isButton?: boolean }) {
  const onMenuPress: OnPressMenuItemEvent = ({ nativeEvent }) => {
    onGenericHapticFeedback();
    switch (nativeEvent.actionKey) {
      case "Upvote":
        feedItem.onVotePress(1, false);
        break;
      case "Downvote":
        feedItem.onVotePress(-1, false);
        break;
      case "Save":
        feedItem.doSave();
        break;
      case "Reply":
        feedItem.doReply();
        break;
      case "Share":
        feedItem.doShare();
        break;
      case "Report":
        feedItem.doReport();
        break;
      case "BlockUser":
        feedItem.blockCreator();
        break;
      default:
        break;
    }
  };

  if (isButton) {
    return (
      <FeedItemContextMenuButton onPress={onMenuPress}>
        {children}
      </FeedItemContextMenuButton>
    );
  }
  return (
    <FeedItemContextMenuView onPress={onMenuPress}>
      {children}
    </FeedItemContextMenuView>
  );
}

interface IContextMenuProps {
  children: React.ReactNode;
  onPress: OnPressMenuItemEvent;
}

// Use for long press with preview
export function FeedItemContextMenuView({
  children,
  onPress,
}: IContextMenuProps) {
  return (
    <ContextMenuView
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [...menuItemsRenderer()],
      }}
    >
      {children}
    </ContextMenuView>
  );
}

// Use for short press, no preview
export function FeedItemContextMenuButton({
  children,
  onPress,
}: IContextMenuProps) {
  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={onPress}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [...menuItemsRenderer()],
      }}
    >
      {children}
    </ContextMenuButton>
  );
}
