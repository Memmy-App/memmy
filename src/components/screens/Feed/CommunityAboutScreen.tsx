import FastImage from "@gkasdorf/react-native-fast-image";
import { ScrollView, Text, VStack } from "@src/components/common/Gluestack";
import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import CommunityCounts from "./components/Community/CommunityCounts";
import RenderMarkdown from "../../common/Markdown/RenderMarkdown";
import ModeratorList from "./components/Community/ModeratorList";
import {
  useCommunity,
  useCommunityModerators,
} from "../../../stores/communities/communitiesStore";

function Card({
  children,
  title,
  spacing = false,
}: {
  children: React.ReactNode;
  title: string;
  spacing?: boolean;
}) {
  const theme = useThemeOptions();
  return (
    <VStack
      style={{
        backgroundColor: theme.colors.fg,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
      }}
      space={spacing ? "sm" : "xxxs"}
    >
      <Text size="xl" fontWeight="bold">
        {title}
      </Text>
      {children}
    </VStack>
  );
}

function CommunityAboutScreen({ route }: { route: any }) {
  const { t } = useTranslation();
  const theme = useThemeOptions();
  const community = useCommunity(route.params.communityFullName);
  const moderators = useCommunityModerators(route.params.communityFullName);

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <VStack mx="$4">
        {route.params.banner && (
          <FastImage
            source={{
              uri: route.params.banner,
            }}
            style={{ height: 200, width: "100%", opacity: 0.5 }}
          />
        )}
        <VStack py="$4" space="sm">
          <Card title={t("Description")}>
            {community?.community.description ? (
              <RenderMarkdown text={community?.community.description} />
            ) : (
              <Text fontStyle="italic">
                There is no description for this community
              </Text>
            )}
          </Card>
          <Card title={t("Stats")} spacing>
            <CommunityCounts counts={community?.counts} />
          </Card>
          <Card title={t("Moderators")} spacing>
            <ModeratorList moderators={moderators} />
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export default CommunityAboutScreen;
