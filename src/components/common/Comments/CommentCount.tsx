import { HStack, Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";
import Chip from "../Chip";

function CommentCount({
  commentCount,
  newComments,
}: {
  commentCount: number;
  newComments?: number;
}) {
  const unreadCount =
    newComments === commentCount || newComments === 0 ? undefined : newComments;

  const { colors } = useAppSelector(selectThemeOptions);
  return (
    <HStack space="sm">
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
      {unreadCount && (
        <Chip
          text={`+${unreadCount}`}
          color={colors.accent}
          variant="outlined"
          fontSize="xs"
          my={0}
        />
      )}
    </HStack>
  );
}

export default React.memo(CommentCount);
