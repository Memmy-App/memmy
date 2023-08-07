import { Badge, HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import SFIcon from "../icons/SFIcon";
import { ICON_MAP } from "../../../constants/IconMap";

function CommentCount({
  commentCount,
  newComments,
}: {
  commentCount: number;
  newComments?: number;
}) {
  const unreadCount =
    newComments === commentCount || newComments === 0 ? undefined : newComments;

  const { colors } = useThemeOptions();
  return (
    <HStack space="sm" alignItems="center">
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
        <Badge variant="outline" borderColor={colors.accent} size="sm">
          <Badge.Text color={colors.accent}>+{unreadCount}</Badge.Text>
        </Badge>
      )}
    </HStack>
  );
}

export default React.memo(CommentCount);
