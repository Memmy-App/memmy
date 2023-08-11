import { Badge, HStack, Text } from "@src/components/gluestack";
import React from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import SFIcon from "../icons/SFIcon";

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
