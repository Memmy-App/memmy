import FastImage from "@gkasdorf/react-native-fast-image";
import { useTheme } from "native-base";
import { ScrollView, Text, VStack } from "@components/common/Gluestack";
import React from "react";
import { useTranslation } from "react-i18next";
import CommunityCounts from "../../common/CommunityCounts";
import RenderMarkdown from "../../common/Markdown/RenderMarkdown";
import ModeratorList from "../../common/ModeratorList";
import {
  useCommunity,
  useCommunityModerators,
} from "../../../stores/communities/communitiesStore";

function CommunityAboutScreen({ route }: { route: any }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const community = useCommunity(route.params.communityFullName);
  const moderators = useCommunityModerators(route.params.communityFullName);

  return (
    <ScrollView bg={theme.colors.app.bg} flex={1}>
      <VStack mx="$4">
        {route.params.banner && (
          <FastImage
            source={{
              uri: route.params.banner,
            }}
            style={{ height: 200, width: "100%", opacity: 0.5 }}
          />
        )}
        <VStack py="$4">
          <Text size="2xl" fontWeight="bold" textDecorationLine="underline">
            {t("Description")}
          </Text>
          <RenderMarkdown text={route.params.description} />
          <CommunityCounts counts={community.counts} />
          <ModeratorList moderators={moderators} />
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export default CommunityAboutScreen;
