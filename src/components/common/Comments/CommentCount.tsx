import { HStack, Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

function CommentCount({ commentCount }: { commentCount: number }) {
  const { colors } = useAppSelector(selectThemeOptions);
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
