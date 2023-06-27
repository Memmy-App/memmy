import React, { useEffect, useMemo } from "react";
import { HStack, Text, useTheme } from "native-base";
import { IconArrowDown, IconArrowUp } from "tabler-icons-react-native";
import { ILemmyVote } from "../../../lemmy/types/ILemmyVote";

function SmallVoteIcons({
  upvotes,
  downvotes,
  myVote,
  initialVote,
}: {
  upvotes: number;
  downvotes: number;
  myVote: ILemmyVote;
  initialVote: number;
}) {
  const theme = useTheme();

  const upvoteColor =
    myVote === 1 ? theme.colors.app.upvote : theme.colors.app.textSecondary;

  const downvoteColor =
    myVote === -1 ? theme.colors.app.downvote : theme.colors.app.textSecondary;

  return useMemo(
    () => (
      <HStack space={1}>
        <HStack alignItems="center">
          <IconArrowUp color={upvoteColor} size={18} />
          <Text color={upvoteColor}>
            {myVote === 1 ? upvotes + 1 : upvotes}
          </Text>
        </HStack>
        <HStack alignItems="center">
          <IconArrowDown color={downvoteColor} size={18} />
          <Text color={downvoteColor}>
            {myVote === -1 ? downvotes + 1 : downvotes}
          </Text>
        </HStack>
      </HStack>
    ),
    [upvotes, downvotes, myVote]
  );
}

export default SmallVoteIcons;
