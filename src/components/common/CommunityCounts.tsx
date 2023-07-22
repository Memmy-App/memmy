import { CommunityAggregates } from "lemmy-js-client";
import React from "react";
import { useTheme } from "native-base";
import { HStack, Text, VStack } from "@components/common/Gluestack";
import Chip from "./Chip";
import { shortenNumber } from "../../helpers/NumberHelper";

interface IProps {
  counts: CommunityAggregates;
}

function CommunityCounts({ counts }: IProps) {
  const theme = useTheme();

  const subscribers = shortenNumber(counts.subscribers);
  const posts = shortenNumber(counts.posts);
  const comments = shortenNumber(counts.comments);
  const usersActiveMonth = shortenNumber(counts.users_active_month);
  const usersActiveWeek = shortenNumber(counts.users_active_week);
  const usersActiveDay = shortenNumber(counts.users_active_day);

  return (
    <VStack paddingTop={4} paddingBottom={4} space="1">
      <Text fontSize="$xl" fontWeight="bold">
        Stats:
      </Text>
      <HStack flexWrap="wrap" space="1" style={{ rowGap: 2 }}>
        <Chip
          text={`${subscribers} Subscribers`}
          color={theme.colors.app.accent}
        />
        <Chip text={`${posts} Posts`} color={theme.colors.app.accent} />
        <Chip text={`${comments} Comments`} color={theme.colors.app.accent} />
        <Chip
          text={`${usersActiveMonth} Users per Month`}
          color={theme.colors.app.accent}
        />
        <Chip
          text={`${usersActiveWeek} Users per Week`}
          color={theme.colors.app.accent}
        />
        <Chip
          text={`${usersActiveDay} Users per Day`}
          color={theme.colors.app.accent}
        />
      </HStack>
    </VStack>
  );
}

export default CommunityCounts;
