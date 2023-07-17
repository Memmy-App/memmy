import React from "react";
import {
  ContextMenuButton,
  ContextMenuView,
  OnPressMenuItemEvent,
} from "react-native-ios-context-menu";
import { PostView } from "lemmy-js-client";
import { UseFeedItem } from "../../../hooks/feeds/useFeedItem";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { ICON_MAP } from "../../../constants/IconMap";
import { shareLink } from "../../../helpers/ShareHelper";

export const FEED_OPTIONS: Record<
  string,
  { display: string; icon: string; destructive?: boolean }
> = {
  Upvote: {
    display: "Upvote",
    icon: ICON_MAP.UPVOTE,
  },
  Downvote: {
    display: "Downvote",
    icon: ICON_MAP.DOWNVOTE,
  },
  Reply: {
    display: "Reply",
    icon: ICON_MAP.REPLY,
  },
  Save: {
    display: "Save",
    icon: ICON_MAP.SAVE,
  },
  Share: {
    display: "Share Post",
    icon: ICON_MAP.SHARE,
  },
  Hide: {
    display: "Mark as Read",
    icon: ICON_MAP.HIDE,
  },
  Report: {
    display: "Report Post",
    icon: ICON_MAP.REPORT_POST,
  },
  BlockUser: {
    display: "Block User",
    icon: ICON_MAP.BLOCK_USER,
    destructive: true,
  },
  Community: {
    display: "Community",
    icon: "person.2",
  },
};

const FEED_COMMUNITY_OPTIONS: Record<
  string,
  { display: string; icon: string; destructive?: boolean }
> = {
  Subscribe: {
    display: "Subscribe",
    icon: ICON_MAP.SUBSCRIBE,
  },
  BlockCommunity: {
    display: "Block",
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
        actionTitle: value.display,
        menuItems: [
          ...Object.entries(FEED_COMMUNITY_OPTIONS).map(
            ([commKey, commValue]) => ({
              actionKey: commKey,
              actionTitle: commValue.display,
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
      actionTitle: value.display,
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
  onPress: OnPressMenuItemEvent;
  feedItem: UseFeedItem;
  post: PostView;
}

export function FeedItemContextMenu({
  children,
  onPress,
  feedItem,
  isButton = false,
  post,
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
      case "Hide":
        feedItem.setPostRead();
        break;
      case "Share":
        shareLink({
          link: post.post.ap_id,
          title: post.post.name,
        });
        break;
      case "Report":
        feedItem.doReport();
        break;
      // case "BlockUser":
      //   useBlockUser
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
