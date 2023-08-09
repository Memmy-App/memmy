import { CommunityAggregates } from "lemmy-js-client";
import { HStack, Text, VStack } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { useTranslation } from "react-i18next";
import { shortenNumber } from "../../../../../helpers/NumberHelper";
import { SFIcon } from "../../../../common/icons/SFIcon";

function StatBlock({ icon, text }: { icon: string; text: string }) {
  const theme = useThemeOptions();
  return (
    <HStack alignItems="center" space="sm">
      <SFIcon icon={icon} size={14} color={theme.colors.textSecondary} />
      <Text size="sm">{text}</Text>
    </HStack>
  );
}

interface IProps {
  counts: CommunityAggregates;
}

function CommunityCounts({ counts }: IProps) {
  const { t } = useTranslation();

  const subscribers = shortenNumber(counts.subscribers);
  const posts = shortenNumber(counts.posts);
  const comments = shortenNumber(counts.comments);
  const usersActiveMonth = shortenNumber(counts.users_active_month);

  return (
    <HStack space="xl">
      <VStack space="xs">
        <StatBlock icon="person" text={`${subscribers} ${t("Subscribers")}`} />
        <StatBlock icon="doc.plaintext" text={`${posts} ${t("Posts")}`} />
      </VStack>
      <VStack space="xs">
        <StatBlock
          icon="bolt"
          text={`${usersActiveMonth} ${t("Users active")}`}
        />
        <StatBlock
          icon="bubble.left.and.bubble.right"
          text={`${comments} ${t("Comments")}`}
        />
      </VStack>
    </HStack>
  );
}

export default CommunityCounts;
