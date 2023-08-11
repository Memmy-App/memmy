/* eslint-disable @typescript-eslint/no-unused-vars */
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { VStack } from "@src/components/common/Gluestack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useThemeOptions } from "@root/src/stores/settings/settingsStore";

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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const theme = useThemeOptions();

  useEffect(() => {
    if (selectedIndex === 0) {
      onUnreadPress();
    } else {
      onAllPress();
    }
  }, [selectedIndex]);

  return (
    <VStack my="$2" mx="$4" space="sm">
      <SegmentedControl
        style={{ flex: 1 }}
        fontStyle={{ color: theme.colors.textPrimary }}
        tintColor={theme.colors.bg}
        values={[t("Unread"), t("All")]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {/* <ButtonGroup>
          <GroupButton
            onPress={onRepliesPress}
            text={t("Replies")}
            selected={bottomSelected === "replies"}
          />
        </ButtonGroup> */}
    </VStack>
  );
}

export default InboxTabs;
