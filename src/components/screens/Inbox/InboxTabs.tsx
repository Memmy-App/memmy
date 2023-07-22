import React from "react";
import { HStack } from "@components/common/Gluestack";
import { useTranslation } from "react-i18next";
import ButtonGroup from "../../common/Buttons/ButtonGroup";
import GroupButton from "../../common/Buttons/GroupButton";

function InboxTabs({
  onUnreadPress,
  onAllPress,
  onRepliesPress,
  topSelected,
  bottomSelected,
}: {
  onUnreadPress: () => void;
  onAllPress: () => void;
  onRepliesPress: () => void;
  topSelected: "unread" | "all";
  bottomSelected: "replies" | "mentions" | "messages";
}) {
  const { t } = useTranslation();

  return (
    <>
      <HStack pt="$2">
        <ButtonGroup>
          <GroupButton
            onPress={onUnreadPress}
            text={t("Unread")}
            selected={topSelected === "unread"}
          />
          <GroupButton
            onPress={onAllPress}
            text={t("All")}
            selected={topSelected === "all"}
          />
        </ButtonGroup>
      </HStack>
      <HStack>
        <ButtonGroup>
          <GroupButton
            onPress={onRepliesPress}
            text={t("Replies")}
            selected={bottomSelected === "replies"}
          />
        </ButtonGroup>
      </HStack>
    </>
  );
}

export default InboxTabs;
