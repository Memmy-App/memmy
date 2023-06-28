import React from "react";
import { HStack } from "native-base";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import GroupButton from "../../ui/buttons/GroupButton";

function InboxTabs({
  onUnreadPress,
  onAllPress,
  onRepliesPress,
  onMentionsPress,
  onMessagesPress,
  topSelected,
  bottomSelected,
}: {
  onUnreadPress: () => void;
  onAllPress: () => void;
  onRepliesPress: () => void;
  onMentionsPress: () => void;
  onMessagesPress: () => void;
  topSelected: "unread" | "all";
  bottomSelected: "replies" | "mentions" | "messages";
}) {
  return (
    <>
      <HStack pt={2}>
        <ButtonGroup>
          <GroupButton
            onPress={onUnreadPress}
            text="Unread"
            selected={topSelected === "unread"}
          />
          <GroupButton
            onPress={onAllPress}
            text="All"
            selected={topSelected === "all"}
          />
        </ButtonGroup>
      </HStack>
      <HStack>
        <ButtonGroup>
          <GroupButton
            onPress={onRepliesPress}
            text="Replies"
            selected={bottomSelected === "replies"}
          />
          <GroupButton
            onPress={onMentionsPress}
            text="Mentions"
            selected={bottomSelected === "mentions"}
          />
          <GroupButton
            onPress={onMessagesPress}
            text="Messages"
            selected={bottomSelected === "messages"}
          />
        </ButtonGroup>
      </HStack>
    </>
  );
}

export default InboxTabs;
