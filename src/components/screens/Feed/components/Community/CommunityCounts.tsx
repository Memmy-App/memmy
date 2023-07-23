import { CommunityAggregates } from "lemmy-js-client";
import { HStack, Text, VStack, useTheme } from "native-base";
import React from "react";
import { shortenNumber } from "../../../../../helpers/NumberHelper";
import { SFIcon } from "../../../../common/icons/SFIcon";

function StatBlock({ icon, text }: { icon: string; text: string }) {
  const theme = useTheme();
  return (
    <HStack alignItems="center" space={1.5}>
      <SFIcon icon={icon} size={14} color={theme.colors.app.textSecondary} />
      <Text>{text}</Text>
    </HStack>
  );
}

interface IProps {
  counts: CommunityAggregates;
}

function CommunityCounts({ counts }: IProps) {
  const subscribers = shortenNumber(counts.subscribers);
  const posts = shortenNumber(counts.posts);
  const comments = shortenNumber(counts.comments);
  const usersActiveMonth = shortenNumber(counts.users_active_month);

  return (
    <HStack space={5}>
      <VStack space={1}>
        <StatBlock icon="person" text={`${subscribers} subscribers`} />
        <StatBlock icon="doc.plaintext" text={`${posts} posts`} />
      </VStack>
      <VStack space={1}>
        <StatBlock icon="bolt" text={`${usersActiveMonth} users active`} />
        <StatBlock
          icon="bubble.left.and.bubble.right"
          text={`${comments} comments`}
        />
      </VStack>
    </HStack>
  );
}

export default CommunityCounts;
