import FastImage from "@gkasdorf/react-native-fast-image";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, Text, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { shortenNumber } from "../../../helpers/NumberHelper";
import useCommunityFeed from "../../../hooks/feeds/useCommunityFeed";
import CustomButton from "../../common/Buttons/CustomButton";
import { PlanetIcon } from "../../common/icons/PlanetIcon";
import SFIcon from "../../common/icons/SFIcon";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import FeedView from "./components/FeedView";

function FeedsCommunityScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const { communityFullName, communityName, actorId } = route.params;

  const communityFeed = useCommunityFeed(communityFullName);
  const { t } = useTranslation();
  const theme = useTheme();

  const headerTitle = () => (
    <VStack alignItems="center">
      <Text fontSize={16} fontWeight="semibold">
        {communityName.toString()}
      </Text>
      <Text fontSize={12}>@{getBaseUrl(actorId?.toString())}</Text>
    </VStack>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
      title: communityName,
    });

    communityFeed.feed.doLoad();
  }, []);

  if (communityFeed.feed.communityNotFound) {
    return <NotFoundView />;
  }

  if (communityFeed.feed.communityError || communityFeed.feed.postsError) {
    return <LoadingErrorView onRetryPress={communityFeed.feed.doLoad} />;
  }

  const header = () => {
    if (communityFeed.feed.communityLoading || !communityFeed.feed.community) {
      return null;
    }

    return (
      <VStack pt={10} pb={5} px={5}>
        <HStack alignItems="center" space={5}>
          {communityFeed.feed.community.community.icon ? (
            <FastImage
              source={{
                uri: communityFeed.feed.community.community.icon,
              }}
              style={{
                height: 96,
                width: 96,
                borderRadius: 100,
              }}
            />
          ) : (
            <PlanetIcon color={theme.colors.app.textSecondary} size={64} />
          )}

          <VStack alignContent="center">
            <HStack space={3}>
              <HStack alignItems="center">
                <SFIcon
                  icon="person"
                  color={theme.colors.app.textSecondary}
                  size={12}
                  boxSize={18}
                />
                <Text color={theme.colors.app.textSecondary}>
                  {shortenNumber(
                    communityFeed.feed.community.counts.subscribers
                  )}
                </Text>
              </HStack>
              <HStack space={1} alignItems="center">
                <SFIcon
                  icon="eye"
                  color={theme.colors.app.textSecondary}
                  size={12}
                  boxSize={18}
                />
                <Text color={theme.colors.app.textSecondary}>
                  {communityFeed.feed.community.counts.users_active_month}
                </Text>
              </HStack>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {communityFeed.feed.community.community.name}
            </Text>
            <Text fontSize="md" color={theme.colors.app.textSecondary} mt={-2}>
              {getBaseUrl(communityFeed.feed.community.community.actor_id)}
            </Text>
          </VStack>
        </HStack>
        <VStack pt={8}>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <CustomButton
              onPress={communityFeed.onSubscribePress}
              icon={
                communityFeed.feed.community.subscribed === "Subscribed" ||
                communityFeed.feed.community.subscribed === "Pending"
                  ? "heart.fill"
                  : "heart"
              }
              text={
                communityFeed.feed.community.subscribed === "Subscribed" ||
                communityFeed.feed.community.subscribed === "Pending"
                  ? t("Subscribed")
                  : t("Subscribe")
              }
            />
            <CustomButton
              onPress={communityFeed.onAboutPress}
              icon="info.circle"
              text={t("About")}
            />
            <CustomButton
              onPress={communityFeed.onPostPress}
              icon="plus"
              text={t("Post")}
            />
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return <FeedView feed={communityFeed.feed} community header={header} />;
}

export default FeedsCommunityScreen;
