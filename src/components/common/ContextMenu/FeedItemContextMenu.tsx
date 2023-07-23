import React from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { onGenericHapticFeedback } from "../../../helpers/HapticFeedbackHelpers";
import { UseFeedItem } from "../../../hooks/feeds/useFeedItem";
import { useFeedOptions } from "../../../hooks/contextMenu/useFeedOptions";
import { AppContextMenuButton } from "./App/AppContextMenuButton";
import { AppContextMenuView } from "./App/AppContextMenuView";

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
  const feedOptions = useFeedOptions();

  return (
    <AppContextMenuView onPressMenuItem={onPress} options={feedOptions}>
      {children}
    </AppContextMenuView>
  );
}

// Use for short press, no preview
export function FeedItemContextMenuButton({
  children,
  onPress,
}: IContextMenuProps) {
  const feedOptions = useFeedOptions();

  return (
    <AppContextMenuButton options={feedOptions} onPressMenuItem={onPress}>
      {children}
    </AppContextMenuButton>
  );
}
