import React from "react";
import { HStack, View } from "native-base";
import ButtonGroup from "../../ui/buttons/ButtonGroup";
import GroupButton from "../../ui/buttons/GroupButton";
import ButtonTwo from "../../ui/buttons/ButtonTwo";
import ButtonOne from "../../ui/buttons/ButtonOne";

function InboxTabs({
  onUnreadPress,
  onAllPress,
  onRepliesPress,
  onMentionsPress,
  onMessagesPress,
  topSelected,
  bottomSelected,
}: {
  onUnreadPress: () => Promise<void>;
  onAllPress: () => Promise<void>;
  onRepliesPress: () => Promise<void>;
  onMentionsPress: () => Promise<void>;
  onMessagesPress: () => Promise<void>;
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
