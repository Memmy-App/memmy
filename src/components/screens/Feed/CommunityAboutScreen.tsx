import FastImage from "@gkasdorf/react-native-fast-image";
import { ScrollView, Text, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useCommunity from "../../../hooks/communities/useCommunity";
import CommunityCounts from "../../common/CommunityCounts";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NotFoundView from "../../common/Loading/NotFoundView";
import RenderMarkdown from "../../common/Markdown/RenderMarkdown";
import ModeratorList from "../../common/ModeratorList";

function CommunityAboutScreen({ route }: { route: any }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const community = useCommunity(route.params.communityId);

  useEffect(() => {
    community.doLoad();
  }, []);

  if (community.communityNotFound) {
    return <NotFoundView />;
  }

  if (community.communityLoading || !community.community) {
    return <LoadingView />;
  }

  if (community.communityError) {
    return <LoadingErrorView onRetryPress={community.doLoad} />;
  }

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
          <CommunityCounts counts={community.community.counts} />
          <ModeratorList moderators={community.moderators} />
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export default CommunityAboutScreen;
