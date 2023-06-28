import React, { useEffect, useMemo, useRef } from "react";
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
import PagerView from "react-native-pager-view";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCakeDay } from "../../../helpers/TimeHelper";
import useProfile from "../../hooks/profile/useProfile";
import CompactFeedItem from "../../ui/Feed/CompactFeedItem/CompactFeedItem";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import ProfileTabs from "./ProfileTabs";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import LoadingView from "../../ui/Loading/LoadingView";
import NotFoundView from "../../ui/Loading/NotFoundView";

function UserProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const profile = useProfile(
    route.params && route.params.fullUsername
      ? route.params.fullUsername
      : undefined
  );
  const theme = useTheme();

  const pagerView = useRef<PagerView>();

  useEffect(() => {
    if (!route.params || !route.params.fullUsername) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <HeaderIconButton
            icon={<IconSettings size={24} color={theme.colors.app.accent} />}
            onPress={() => navigation.push("Settings")}
          />
        ),
      });
    }

    navigation.setOptions({
      title:
        route.params && route.params.fullUsername
          ? route.params.fullUsername
          : "My Profile",
    });
  }, []);

  const refreshControl = (
    <RefreshControl
      refreshing={profile.refreshing}
      onRefresh={() => {
        profile.doLoad(true).then();
      }}
    />
  );

  const renderComment = ({ item }: { item: ILemmyComment }) => (
    <CommentItem
      comment={item}
      setComments={profile.setComments}
      opId={0}
      depth={2}
      onPressOverride={() => {
        const commentPathArr = item.comment.comment.path.split(".");

        if (commentPathArr.length === 2) {
          profile
            .onCommentPress(item.comment.post.id, item.comment.comment.id)
            .then();
        } else {
          profile
            .onCommentPress(
              item.comment.post.id,
              Number(commentPathArr[commentPathArr.length - 2])
            )
            .then();
        }
      }}
    />
  );

  const renderPost = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

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
          selected={profile.selected}
          onCommentsPress={() => {
            profile.setSelected("comments");
            pagerView.current.setPageWithoutAnimation(0);
          }}
          onPostsPress={() => {
            profile.setSelected("posts");
            pagerView.current.setPageWithoutAnimation(1);
          }}
        />
      </VStack>
    );
  }, [profile.profile, profile.selected]);

  const commentKeyExtractor = (item: ILemmyComment) =>
    (item as ILemmyComment).comment.comment.id.toString();

  const postKeyExtractor = (item: PostView) =>
    (item as PostView).post.id.toString();

  const commentList = useMemo(
    () => (
      <FlashList
        renderItem={renderComment}
        ListHeaderComponent={header}
        estimatedItemSize={100}
        data={profile.comments}
        keyExtractor={commentKeyExtractor}
        ListEmptyComponent={<Spinner pt={10} />}
        refreshing={profile.loading}
        refreshControl={refreshControl}
      />
    ),
    [profile.comments, profile.loading, profile.refreshing, profile.selected]
  );

  const postList = useMemo(
    () => (
      <FlashList
        renderItem={renderPost}
        ListHeaderComponent={header}
        estimatedItemSize={100}
        data={profile.posts}
        keyExtractor={postKeyExtractor}
        ListEmptyComponent={<Spinner pt={10} />}
        refreshing={profile.loading}
        refreshControl={refreshControl}
      />
    ),
    [profile.posts, profile.loading, profile.refreshing, profile.selected]
  );

  return useMemo(() => {
    if (profile.notFound) {
      return <NotFoundView />;
    }

    if (!profile.profile) {
      return <LoadingView />;
    }

    if (profile.error) {
      return <LoadingErrorView onRetryPress={() => profile.doLoad(true)} />;
    }

    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <PagerView
          initialPage={0}
          style={{ flex: 1 }}
          scrollEnabled={false}
          ref={pagerView}
        >
          <View key="1">{commentList}</View>
          <View key="2">{postList}</View>
        </PagerView>
      </VStack>
    );
  }, [
    profile.error,
    profile.selected,
    profile.notFound,
    profile.profile,
    profile.loading,
    profile.refreshing,
  ]);
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
