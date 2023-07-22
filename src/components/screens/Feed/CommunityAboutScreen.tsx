import FastImage from "@gkasdorf/react-native-fast-image";
import { ScrollView, Text, useTheme, VStack } from "native-base";
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
    <ScrollView flex={1} backgroundColor={theme.colors.app.bg}>
      <VStack mx={4}>
        {route.params.banner && (
          <FastImage
            source={{
              uri: route.params.banner,
            }}
            style={{ height: 200, width: "100%", opacity: 0.5 }}
          />
        )}
        <VStack py={4}>
          <Text fontSize="2xl" fontWeight="bold" underline>
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
