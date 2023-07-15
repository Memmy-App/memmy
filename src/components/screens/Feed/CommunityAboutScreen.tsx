import React, { useEffect } from "react";
import { ScrollView, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { IconPlanet } from "tabler-icons-react-native";
import RenderMarkdown from "../../common/Markdown/RenderMarkdown";
import useCommunity from "../../../hooks/communities/useCommunity";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import AvatarUsername from "../../common/AvatarUsername";

function CommunityAboutScreen({ route }: { route: any }) {
  const theme = useTheme();
  const community = useCommunity(route.params.communityId);

  useEffect(() => {
    community.doLoad();
  }, []);

  if (community.communityNotFound) {
    return <NotFoundView />;
  }

  if (community.communityLoading || !community.community) {
    return null;
  }

  if (community.communityError) {
    return <LoadingErrorView onRetryPress={community.doLoad} />;
  }

  return (
    <ScrollView flex={1} backgroundColor={theme.colors.app.bg}>
      <VStack>
        {route.params.banner ? (
          <FastImage
            source={{
              uri: route.params.banner,
            }}
            style={{ height: 200, width: "100%", opacity: 0.5 }}
          />
        ) : (
          <IconPlanet />
        )}
        <VStack p={4}>
          <Text fontSize="2xl" fontWeight="bold" underline>
            Description
          </Text>
          <RenderMarkdown text={route.params.description} />
          <Text fontSize="xl" fontWeight="bold">
            Mods:
          </Text>
          <VStack p={1}>
            {[...community.moderators].map((moderator) => (
              <Text key={moderator.moderator.id}>
                - <AvatarUsername creator={moderator.moderator} isMod />
              </Text>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

export default CommunityAboutScreen;
