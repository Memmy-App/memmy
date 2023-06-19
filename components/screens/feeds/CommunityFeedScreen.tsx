import React, { useEffect } from "react";
import { HStack, InfoIcon, Text, useTheme, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import {
  IconEye,
  IconHeart,
  IconInfoCircle,
  IconStar,
  IconUserHeart,
} from "tabler-icons-react-native";
import { SearchBar } from "react-native-screens";
import FeedView from "../../ui/Feed/FeedView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { useFeed } from "../../hooks/feeds/feedsHooks";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ButtonOne from "../../ui/buttons/ButtonOne";

function FeedsCommunityScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const { communityFullName, communityName, actorId } = route.params;

  const feed = useFeed(communityFullName);

  const theme = useTheme();

  const headerTitle = () => (
    <VStack alignItems="center">
      <Text fontSize={16} fontWeight="semibold">
        {communityName.toString()}
      </Text>
      <Text fontSize={12}>@{getBaseUrl(actorId.toString())}</Text>
    </VStack>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
      title: communityName,
    });

    feed.doLoad();
  }, []);

  if (feed.communityError || feed.postsError) {
    return <LoadingErrorView onRetryPress={feed.doLoad} />;
  }

  const header = () => {
    if (feed.communityLoading || !feed.community) return null;

    return (
      <VStack pt={10} pb={5} px={5}>
        <HStack alignItems="center" space={5}>
          <FastImage
            source={{
              uri: feed.community.community.icon,
            }}
            style={{
              height: 96,
              width: 96,
              borderRadius: 100,
            }}
          />
          <VStack alignContent="center">
            <HStack space={2}>
              <HStack space={1}>
                <IconUserHeart color={theme.colors.app.iconColor} size={20} />
                <Text color={theme.colors.app.secondaryText}>
                  {feed.community.counts.subscribers}
                </Text>
              </HStack>
              <HStack space={1}>
                <IconEye color={theme.colors.app.iconColor} size={20} />
                <Text color={theme.colors.app.secondaryText}>
                  {feed.community.counts.users_active_month}
                </Text>
              </HStack>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {feed.community.community.name}
            </Text>
            <Text fontSize="md" color={theme.colors.app.secondaryText} mt={-2}>
              {getBaseUrl(feed.community.community.actor_id)}
            </Text>
          </VStack>
        </HStack>
        <VStack pt={8}>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <ButtonOne onPress={() => {}} icon={IconHeart} text="Subscribe" />
            <ButtonOne onPress={() => {}} icon={IconInfoCircle} text="About" />
            <ButtonOne onPress={() => {}} icon={IconStar} text="Favorite" />
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return <FeedView feed={feed} community header={header} />;
}

export default FeedsCommunityScreen;
