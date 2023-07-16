import React from "react";
import { HStack, Text, useTheme } from "native-base";
import { IconArrowDown, IconArrowUp } from "tabler-icons-react-native";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";

function SmallVoteIcons({
  upvotes,
  downvotes,
  myVote,
}: {
  upvotes: number;
  downvotes: number;
  myVote: ILemmyVote;
}) {
  const theme = useTheme();

  const upvoteColor =
    myVote === 1 ? theme.colors.app.upvote : theme.colors.app.textSecondary;

  const downvoteColor =
    myVote === -1 ? theme.colors.app.downvote : theme.colors.app.textSecondary;

  // TODO: refactor to use VoteData
  return (
    <HStack space={1}>
      <HStack alignItems="center">
        <IconArrowUp color={upvoteColor} size={18} />
        <Text color={upvoteColor}>{upvotes}</Text>
      </HStack>
      <HStack alignItems="center">
        <IconArrowDown color={downvoteColor} size={18} />
        <Text color={downvoteColor}>{downvotes}</Text>
      </HStack>
    </HStack>
  );
}

export default React.memo(SmallVoteIcons);
