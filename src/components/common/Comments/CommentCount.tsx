import { HStack, Text, useTheme } from "native-base";
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
  const { colors } = useTheme();
  return (
    <HStack space={2}>
      <HStack alignItems="center" space={0.5}>
        <SFIcon
          color={colors.app.textSecondary}
          icon={ICON_MAP.REPLY}
          size={10}
          boxSize={20}
        />
        <Text color={colors.app.textSecondary} fontSize="sm">
          {commentCount}
        </Text>
      </HStack>
      {!!newComments && (
        <Chip
          text={`+${newComments}`}
          color={colors.app.accent}
          variant="outlined"
          fontSize="xs"
          my={0}
        />
      )}
    </HStack>
  );
}

export default React.memo(CommentCount);
