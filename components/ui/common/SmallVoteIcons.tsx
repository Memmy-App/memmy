import React, { useCallback, useMemo } from "react";
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

  return useMemo(
    () => (
      <HStack space={1}>
        <HStack alignItems="center">
          <IconArrowUp
            color={
              myVote === 1
                ? theme.colors.app.upvoteColor
                : theme.colors.app.iconColor
            }
            size={18}
          />
          <Text>
            {myVote === 1 && initialVote !== 1 ? upvotes + 1 : upvotes}
          </Text>
        </HStack>
        <HStack alignItems="center">
          <IconArrowDown
            color={
              myVote === -1
                ? theme.colors.app.downvoteColor
                : theme.colors.app.iconColor
            }
            size={18}
          />
          <Text>
            {myVote === -1 && initialVote !== -1 ? downvotes + 1 : downvotes}
          </Text>
        </HStack>
      </HStack>
    ),
    [upvotes, downvotes, myVote]
  );
}

export default SmallVoteIcons;
