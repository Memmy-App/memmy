import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { useTheme, View, VStack } from "native-base";
import { RefreshControl } from "react-native";
import { IconSettings } from "tabler-icons-react-native";
import PagerView from "react-native-pager-view";
import useProfile from "../../hooks/profile/useProfile";
import CompactFeedItem from "../../ui/Feed/CompactFeedItem/CompactFeedItem";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import LoadingView from "../../ui/Loading/LoadingView";
import NotFoundView from "../../ui/Loading/NotFoundView";
import NoResultView from "../../ui/common/NoResultView";
import UserProfileHeader from "./UserProfileHeader";

function UserProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  // Refs
  const pagerView = useRef<PagerView>();

  // Hooks
  const profile = useProfile(
    route.params && route.params.fullUsername
      ? route.params.fullUsername
      : undefined
  );
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      title:
        route.params && route.params.fullUsername
          ? route.params.fullUsername
          : "My Profile",
      headerRight:
        !route.params || !route.params.fullUsername
          ? () => (
              <HeaderIconButton
                icon={
                  <IconSettings size={24} color={theme.colors.app.accent} />
                }
                onPress={() => navigation.push("Settings")}
              />
            )
          : undefined,
    });
  }, []);

  const onPressOverride = useCallback((item) => {
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
      onPressOverride={() => onPressOverride(item)}
    />
  );

  const renderPost = ({ item }: { item: PostView }) => (
    <CompactFeedItem post={item as PostView} />
  );

  const commentKeyExtractor = (item: ILemmyComment) =>
    (item as ILemmyComment).comment.comment.id.toString();

  const postKeyExtractor = (item: PostView) =>
    (item as PostView).post.id.toString();

  const commentList = useMemo(
    () => (
      <FlashList
        renderItem={renderComment}
        ListHeaderComponent={
          <UserProfileHeader profile={profile} pagerView={pagerView} />
        }
        estimatedItemSize={100}
        data={profile.comments}
        keyExtractor={commentKeyExtractor}
        ListEmptyComponent={<NoResultView type="comments" />}
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
        ListHeaderComponent={
          <UserProfileHeader profile={profile} pagerView={pagerView} />
        }
        estimatedItemSize={100}
        data={profile.posts}
        keyExtractor={postKeyExtractor}
        ListEmptyComponent={<NoResultView type="posts" />}
        refreshing={profile.loading}
        refreshControl={refreshControl}
      />
    ),
    [profile.posts, profile.loading, profile.refreshing, profile.selected]
  );

  const savedPostList = useMemo(
    () => (
      <FlashList
        renderItem={renderPost}
        ListHeaderComponent={
          <UserProfileHeader profile={profile} pagerView={pagerView} />
        }
        estimatedItemSize={100}
        data={profile.savedPosts}
        keyExtractor={postKeyExtractor}
        ListEmptyComponent={<NoResultView type="posts" />}
        refreshing={profile.loading}
        refreshControl={refreshControl}
      />
    ),
    [profile.posts, profile.loading, profile.refreshing, profile.selected]
  );

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={() => profile.doLoad(true)} />;
  }

  if (profile.notFound) {
    return <NotFoundView />;
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
        {profile.savedPosts && <View key="3">{savedPostList}</View>}
      </PagerView>
    </VStack>
  );
}

export default UserProfileScreen;
