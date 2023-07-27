import { HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

function CommentCount({ commentCount }: { commentCount: number }) {
  const { colors } = useThemeOptions();
  return (
    <HStack alignItems="center" space="xxs">
      <SFIcon
        color={colors.textSecondary}
        icon={ICON_MAP.REPLY}
        size={10}
        boxSize={20}
      />
      <Text color={colors.textSecondary} size="sm">
        {commentCount}
      </Text>
    </HStack>
  );
}

export default React.memo(CommentCount);
