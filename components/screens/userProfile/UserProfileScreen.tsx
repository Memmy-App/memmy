import React, { useEffect, useMemo } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import moment from "moment";
import {
  Box,
  HStack,
  Spinner,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import { RefreshControl, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
  IconCake,
  IconCalendarStar,
  IconCircleArrowUp,
  IconMessage2,
  IconNotes,
  IconSettings,
  IconUser,
} from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCakeDay } from "../../../helpers/TimeHelper";
import useProfile from "../../hooks/profile/useProfile";
import CompactFeedItem from "../../ui/Feed/CompactFeedItem";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import LoadingView from "../../ui/Loading/LoadingView";
import NotFoundView from "../../ui/Loading/NotFoundView";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import ProfileTabs from "./ProfileTabs";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";

function UserProfileScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const profile = useProfile();
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HeaderIconButton
          icon={<IconSettings size={24} color={theme.colors.app.accent} />}
          onPress={() => navigation.push("Settings")}
        />
      ),
    });
  }, []);

  const refreshControl = (
    <RefreshControl
      refreshing={profile.loading}
      onRefresh={() => {
        profile.doLoad(true);
      }}
    />
  );

  const renderItem = ({ item }: { item: ILemmyComment | PostView }) => {
    if (profile.selectedTab === "comments") {
      const comment = item as ILemmyComment;
      return (
        <CommentItem
          comment={comment}
          setComments={profile.setItems}
          opId={0}
          depth={2}
          onPressOverride={() => {
            const commentPathArr = comment.comment.comment.path.split(".");

            if (commentPathArr.length === 2) {
              profile
                .onCommentPress(
                  comment.comment.post.id,
                  comment.comment.comment.id
                )
                .then();
            } else {
              profile
                .onCommentPress(
                  comment.comment.post.id,
                  Number(commentPathArr[commentPathArr.length - 2])
                )
                .then();
            }
          }}
        />
      );
    }
    if (profile.selectedTab === "posts") {
      return <CompactFeedItem post={item as PostView} />;
    }

    return null;
  };

  const header = useMemo(() => {
    if (!profile.profile) return null;
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <View style={styles.bannerContainer}>
          <HStack
            alignItems="flex-end"
            position="absolute"
            height="100%"
            width="100%"
            zIndex={1}
            px={2}
            py={3.5}
            space={4}
          >
            {profile.profile.person.avatar ? (
              <FastImage
                source={{
                  uri: profile.profile.person.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <IconUser color={theme.colors.app.textSecondary} size={64} />
            )}
            <VStack>
              <Text fontWeight="semibold" fontSize="2xl">
                {profile.profile.person.name}
              </Text>
              <Text fontSize="lg">
                @{getBaseUrl(profile.profile.person.actor_id)}
              </Text>
            </VStack>
          </HStack>
          {profile.profile.person.banner ? (
            <FastImage
              resizeMode="cover"
              style={styles.banner}
              source={{
                uri: profile.profile.person.banner,
              }}
            />
          ) : (
            <Box style={styles.banner} />
          )}
        </View>
        <VStack py={3.5} px={5}>
          <HStack space={7}>
            <HStack alignItems="center" space={1}>
              <IconNotes size={26} color={theme.colors.app.textSecondary} />
              <Text fontSize="md">{profile.profile.counts.post_count}</Text>
              <IconCircleArrowUp
                size={26}
                color={theme.colors.app.textSecondary}
              />
              <Text fontSize="md">{profile.profile.counts.post_score}</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <IconMessage2 size={26} color={theme.colors.app.textSecondary} />
              <Text fontSize="md">{profile.profile.counts.comment_count}</Text>
              <IconCircleArrowUp
                size={26}
                color={theme.colors.app.textSecondary}
              />
              <Text fontSize="md">{profile.profile.counts.comment_score}</Text>
            </HStack>
          </HStack>
          <HStack space={7} mt={3} alignItems="center">
            <HStack alignItems="center" space={1}>
              <IconCalendarStar
                size={26}
                color={theme.colors.app.textSecondary}
              />
              <Text fontSize="md">
                {moment(profile.profile.person.published).utc(true).fromNow()}
              </Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <IconCake size={26} color={theme.colors.app.textSecondary} />
              <Text fontSize="md">
                {getCakeDay(profile.profile.person.published)}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        <ProfileTabs
          selected={profile.selectedTab}
          onCommentsPress={() => profile.doLoadItems("comments", true)}
          onPostsPress={() => profile.doLoadItems("posts", true)}
        />
      </VStack>
    );
  }, [profile.profile, profile.selectedTab]);

  const keyExtractor = (item: ILemmyComment | PostView) => {
    if (profile.selectedTab === "comments") {
      return (item as ILemmyComment).comment.comment.id.toString();
    }
    if (profile.selectedTab === "posts") {
      return (item as PostView).post.id.toString();
    }
  };

  if (profile.notFound) {
    return <NotFoundView />;
  }

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={profile.doLoad} />;
  }

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg} display="flex">
      <FlashList
        renderItem={renderItem}
        ListHeaderComponent={header}
        estimatedItemSize={100}
        data={profile.items}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Spinner pt={10} />}
        refreshing={profile.loading}
        refreshControl={refreshControl}
        // onEndReached={() => profile.doLoadItems(profile.selectedTab)}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 165,
    width: "100%",
    opacity: 0.2,
  },

  bannerContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
  },

  avatar: {
    height: 64,
    width: 64,
    borderRadius: 100,
  },
});

export default UserProfileScreen;
