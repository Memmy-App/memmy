import React from "react";
import { OnPressMenuItemEvent } from "react-native-ios-context-menu";
import { onGenericHapticFeedback } from "@src/helpers/haptics/HapticFeedbackHelper";
import { useFeedVote, useOnFeedSave } from "@src/hooks/feed";

interface IProps {
  postId: number;
  children: React.ReactNode;
}

export function FeedItemContextMenu({
  children,
  postId,
  isButton = false,
}: IProps & { isButton?: boolean }): React.JSX.Element {
  const onMenuPress: OnPressMenuItemEvent = ({ nativeEvent }) => {
    const onVote = useFeedVote(postId);
    const onSave = useOnFeedSave(postId);

    onGenericHapticFeedback();
    switch (nativeEvent.actionKey) {
      case "Upvote":
        onVote(1, false);
        break;
      case "Downvote":
        onVote(-1, false);
        break;
      case "Save":
        onSave();
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
