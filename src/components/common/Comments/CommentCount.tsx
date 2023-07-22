import { useTheme } from "native-base";
import { HStack, Text } from "@components/common/Gluestack";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

function CommentCount({ commentCount }: { commentCount: number }) {
  const { colors } = useTheme();
  return (
    <HStack alignItems="center" space="xxs">
      <SFIcon
        color={colors.app.textSecondary}
        icon={ICON_MAP.REPLY}
        size={10}
        boxSize={20}
      />
      <Text color={colors.app.textSecondary} size="sm">
        {commentCount}
      </Text>
    </HStack>
  );
}

export default React.memo(CommentCount);
