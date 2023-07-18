import { CommunityAggregates } from "lemmy-js-client";
import React from "react";
import { HStack, useTheme, Text, VStack } from "native-base";
import Chip from "./Chip";

interface IProps {
  counts: CommunityAggregates;
}

function PrettyNumbers({ num }: { num: number }) {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num;
}

function CommunityCounts({ counts }: IProps) {
  const theme = useTheme();
  const subscribers = PrettyNumbers({ num: counts.subscribers });
  const posts = PrettyNumbers({ num: counts.posts });
  const comments = PrettyNumbers({ num: counts.comments });
  const usersActiveMonth = PrettyNumbers({ num: counts.users_active_month });
  const usersActiveWeek = PrettyNumbers({ num: counts.users_active_week });
  const usersActiveDay = PrettyNumbers({ num: counts.users_active_day });
  return (
    <VStack paddingTop={4} paddingBottom={4} space={1}>
      <Text fontSize="xl" fontWeight="bold">
        Stats:
      </Text>
      <HStack flexWrap="wrap" space={1} style={{ rowGap: 2 }}>
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
