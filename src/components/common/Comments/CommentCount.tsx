import { HStack, Text, useTheme } from "native-base";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

function CommentCount({ commentCount }: { commentCount: number }) {
  const { colors } = useTheme();
  return (
    <HStack alignItems="center" space={0.5}>
      <SFIcon
        color={colors.app.textSecondary}
        icon={ICON_MAP.REPLY}
        size={11}
        style={{ width: 20, height: 20 }}
      />
      <Text color={colors.app.textSecondary} fontSize="sm">
        {commentCount}
      </Text>
    </HStack>
  );
}

export default React.memo(CommentCount);
