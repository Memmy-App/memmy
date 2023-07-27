import { HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { ICON_MAP } from "../../../constants/IconMap";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import SFIcon from "../icons/SFIcon";

function SmallVoteIcons({
  upvotes,
  downvotes,
  myVote,
}: {
  upvotes: number;
  downvotes: number;
  myVote: ILemmyVote;
}) {
  const theme = useThemeOptions();

  const upvoteColor =
    myVote === 1 ? theme.colors.upvote : theme.colors.textSecondary;

  const downvoteColor =
    myVote === -1 ? theme.colors.downvote : theme.colors.textSecondary;

  // TODO: refactor to use VoteData
  return (
    <HStack space="xs">
      <HStack alignItems="center">
        <SFIcon
          icon={ICON_MAP.UPVOTE}
          color={upvoteColor}
          size={10}
          boxSize={18}
        />
        <Text color={upvoteColor}>{upvotes}</Text>
      </HStack>
      <HStack alignItems="center">
        <SFIcon
          icon={ICON_MAP.DOWNVOTE}
          color={downvoteColor}
          size={10}
          boxSize={18}
        />
        <Text color={downvoteColor}>{downvotes}</Text>
      </HStack>
    </HStack>
  );
}

export default React.memo(SmallVoteIcons);
