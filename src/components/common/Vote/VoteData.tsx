import { PostAggregates } from "lemmy-js-client";
import { HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { ICON_MAP } from "@src/constants/IconMap";
import { CommentAggregates } from "lemmy-js-client/dist/types/CommentAggregates";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import SFIcon from "../icons/SFIcon";

interface IProps {
  data: PostAggregates | CommentAggregates;
  myVote?: number;
}

function VoteData({ data, myVote }: IProps) {
  const { colors } = useThemeOptions();
  const displayTotalScore = useSettingsStore(
    (state) => state.settings.displayTotalScore
  );

  const upvoted = myVote === 1;
  const downvoted = myVote === -1;

  if (displayTotalScore) {
    const voteColor = upvoted ? colors.upvote : colors.downvote;
    const color = upvoted || downvoted ? voteColor : colors.textSecondary;

    const scoreArrow = (
      <SFIcon
        icon={
          upvoted || (data.score > 0 && !downvoted)
            ? ICON_MAP.UPVOTE
            : ICON_MAP.DOWNVOTE
        }
        color={color}
        size={10}
        boxSize={20}
      />
    );

    return (
      <HStack alignItems="center">
        {scoreArrow}
        <Text color={color} size="sm">
          {data.score}
        </Text>
      </HStack>
    );
  }

  const upvoteColor = upvoted ? colors.upvote : colors.textSecondary;
  const downvoteColor = downvoted ? colors.downvote : colors.textSecondary;

  return (
    <>
      <HStack alignItems="center">
        <SFIcon
          icon={ICON_MAP.UPVOTE}
          color={upvoteColor}
          size={10}
          boxSize={20}
        />
        <Text color={upvoteColor} size="sm">
          {data.upvotes}
        </Text>
      </HStack>
      <HStack alignItems="center">
        <SFIcon
          icon={ICON_MAP.DOWNVOTE}
          color={downvoteColor}
          size={10}
          boxSize={20}
        />
        <Text color={downvoteColor} size="sm">
          {data.downvotes}
        </Text>
      </HStack>
    </>
  );
}

export default VoteData;
