import React, { useEffect, useRef } from "react";
import { HStack, Text, useTheme, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import {
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconPlus,
  IconUserHeart,
} from "tabler-icons-react-native";
import FeedView from "../../ui/Feed/FeedView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ButtonOne from "../../ui/buttons/ButtonOne";
import { useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import NotFoundView from "../../ui/Loading/NotFoundView";
import useCommunityFeed from "../../hooks/feeds/useCommunityFeed";

function FeedsCommunityScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const { post } = useAppSelector(selectPost);

  const creatingPost = useRef(false);
  const lastPost = useRef(0);

  const { communityFullName, communityName, actorId } = route.params;

  const communityFeed = useCommunityFeed(communityFullName);
  const theme = useTheme();

  useEffect(() => {
    if (creatingPost.current && post && lastPost.current !== post.post.id) {
      creatingPost.current = false;
      setTimeout(() => {
        navigation.push("Post");
      }, 500);
    }
  }, [post]);

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

    communityFeed.feed.doLoad();
  }, []);

  if (communityFeed.feed.communityNotFound) {
    return <NotFoundView />;
  }

  if (communityFeed.feed.communityError || communityFeed.feed.postsError) {
    return <LoadingErrorView onRetryPress={communityFeed.feed.doLoad} />;
  }

  const header = () => {
    if (communityFeed.feed.communityLoading || !communityFeed.feed.community)
      return null;

    return (
      <VStack pt={10} pb={5} px={5}>
        <HStack alignItems="center" space={5}>
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
          <VStack alignContent="center">
            <HStack space={2}>
              <HStack space={1}>
                <IconUserHeart color={theme.colors.app.iconColor} size={20} />
                <Text color={theme.colors.app.secondaryText}>
                  {communityFeed.feed.community.counts.subscribers}
                </Text>
              </HStack>
              <HStack space={1}>
                <IconEye color={theme.colors.app.iconColor} size={20} />
                <Text color={theme.colors.app.secondaryText}>
                  {communityFeed.feed.community.counts.users_active_month}
                </Text>
              </HStack>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {communityFeed.feed.community.community.name}
            </Text>
            <Text fontSize="md" color={theme.colors.app.secondaryText} mt={-2}>
              {getBaseUrl(communityFeed.feed.community.community.actor_id)}
            </Text>
          </VStack>
        </HStack>
        <VStack pt={8}>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <ButtonOne
              onPress={communityFeed.onSubscribePress}
              icon={communityFeed.feed.subscribed ? IconHeartFilled : IconHeart}
              text={communityFeed.feed.subscribed ? "Subscribed" : "Subscribe"}
            />
            <ButtonOne
              onPress={communityFeed.onAboutPress}
              icon={IconInfoCircle}
              text="About"
            />
            <ButtonOne
              onPress={communityFeed.onPostPress}
              icon={IconPlus}
              text="Post"
            />
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return <FeedView feed={communityFeed.feed} community header={header} />;
}

export default FeedsCommunityScreen;
