import { HStack, Text, useTheme } from "native-base";
import React from "react";
import { IconMessage } from "tabler-icons-react-native";

function CommentCount({ commentCount }: { commentCount: number }) {
  const { colors } = useTheme();
  return (
    <HStack alignItems="center" space={0.5}>
      <IconMessage color={colors.app.textSecondary} size={20} />
      <Text color={colors.app.textSecondary} fontSize="sm">
        {commentCount}
      </Text>
    </HStack>
  );
}

export default CommentCount;
