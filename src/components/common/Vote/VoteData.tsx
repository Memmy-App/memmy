import { PostAggregates } from "lemmy-js-client";
import { HStack, Text, useTheme } from "native-base";
import React from "react";
import { IconArrowDown, IconArrowUp } from "tabler-icons-react-native";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppSelector } from "../../../../store";

interface IProps {
  data: PostAggregates;
  vote?: number;
}

function VoteData({ data, vote }: IProps) {
  const { colors } = useTheme();
  const settings = useAppSelector(selectSettings);

  const upvoted = vote === 1;
  const downvoted = vote === -1;

  if (settings.displayTotalScore) {
    const voteColor = upvoted ? colors.app.upvote : colors.app.downvote;
    const color = upvoted || downvoted ? voteColor : colors.app.textSecondary;

    const scoreArrow =
      upvoted || (data.score > 0 && !downvoted) ? (
        <IconArrowUp color={color} size={20} />
      ) : (
        <IconArrowDown color={color} size={20} />
      );

    return (
      <HStack alignItems="center">
        {scoreArrow}
        <Text color={color} fontSize="sm">
          {data.score}
        </Text>
      </HStack>
    );
  }

  const upvoteColor = upvoted ? colors.app.upvote : colors.app.textSecondary;
  const downvoteColor = downvoted
    ? colors.app.downvote
    : colors.app.textSecondary;

  return (
    <>
      <HStack alignItems="center">
        <IconArrowUp color={upvoteColor} size={20} />
        <Text color={upvoteColor} fontSize="sm">
          {data.upvotes}
        </Text>
      </HStack>
      <HStack alignItems="center">
        <IconArrowDown color={downvoteColor} size={20} />
        <Text color={downvoteColor} fontSize="sm">
          {data.downvotes}
        </Text>
      </HStack>
    </>
  );
}

export default VoteData;
