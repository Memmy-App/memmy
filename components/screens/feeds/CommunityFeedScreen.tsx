import React, { useEffect, useRef } from "react";
import { HStack, Text, useTheme, useToast, VStack } from "native-base";
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
import { trigger } from "react-native-haptic-feedback";
import FeedView from "../../ui/Feed/FeedView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { useFeed } from "../../hooks/feeds/feedsHooks";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ButtonOne from "../../ui/buttons/ButtonOne";
import { subscribeToCommunity } from "../../../slices/communities/communitiesActions";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectPost } from "../../../slices/post/postSlice";
import NotFoundView from "../../ui/Loading/NotFoundView";

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

  const feed = useFeed(communityFullName);

  const theme = useTheme();
  const toast = useToast();
  const dispatch = useAppDispatch();

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

    feed.doLoad();
  }, []);

  if (feed.communityNotFound) {
    return <NotFoundView />;
  }

  if (feed.communityError || feed.postsError) {
    return <LoadingErrorView onRetryPress={feed.doLoad} />;
  }

  const onSubscribePress = () => {
    trigger("impactMedium");

    toast.show({
      title: `${!feed.subscribed ? "Subscribed to" : "Unsubscribed from"} ${
        feed.community.community.name
      }`,
      duration: 3000,
    });

    dispatch(
      subscribeToCommunity({
        communityId: feed.community.community.id,
        subscribe: !feed.subscribed,
      })
    );

    feed.setSubscribed((prev) => !prev);
  };

  const onAboutPress = () => {
    navigation.push("CommunityAbout", {
      name: feed.community.community.name,
      banner: feed.community.community.banner,
      description: feed.community.community.description,
      title: feed.community.community.title,
    });
  };

  const onPostPress = () => {
    creatingPost.current = true;
    lastPost.current = post ? post.post.id : 0;

    navigation.push("NewPost", {
      communityId: feed.community.community.id,
      communityName: feed.community.community.name,
    });
  };

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
                <Text color={theme.colors.app.textSecondary}>
                  {feed.community.counts.subscribers}
                </Text>
              </HStack>
              <HStack space={1}>
                <IconEye color={theme.colors.app.iconColor} size={20} />
                <Text color={theme.colors.app.textSecondary}>
                  {feed.community.counts.users_active_month}
                </Text>
              </HStack>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {feed.community.community.name}
            </Text>
            <Text fontSize="md" color={theme.colors.app.textSecondary} mt={-2}>
              {getBaseUrl(feed.community.community.actor_id)}
            </Text>
          </VStack>
        </HStack>
        <VStack pt={8}>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <ButtonOne
              onPress={onSubscribePress}
              icon={feed.subscribed ? IconHeartFilled : IconHeart}
              text={feed.subscribed ? "Subscribed" : "Subscribe"}
            />
            <ButtonOne
              onPress={onAboutPress}
              icon={IconInfoCircle}
              text="About"
            />
            <ButtonOne onPress={onPostPress} icon={IconPlus} text="Post" />
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return <FeedView feed={feed} community header={header} />;
}

export default FeedsCommunityScreen;
