import { PostAggregates } from "lemmy-js-client";
import { HStack, Text } from "@src/components/gluestack";
import React, { useMemo } from "react";
import { CommentAggregates } from "lemmy-js-client/dist/types/CommentAggregates";

import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { ICON_MAP } from "@src/types/constants/IconMap";
import SFIcon from "../icons/SFIcon";

interface IProps {
  data: PostAggregates | CommentAggregates;
  myVote?: number;
}

function VoteData({ data, myVote }: IProps): React.JSX.Element {
  const { colors } = useThemeOptions();
  const displayTotalScore = useSettingsStore(
    (state) => state.displayTotalScore
  );

  const upvoted = useMemo(() => myVote === 1, [myVote]);
  const downvoted = useMemo(() => myVote === -1, [myVote]);

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

export default React.memo(VoteData);
