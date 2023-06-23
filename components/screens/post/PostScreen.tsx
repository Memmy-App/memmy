import React, { useCallback, useEffect, useState } from "react";

import {
  Center,
  Divider,
  HStack,
  Pressable,
  Spinner,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { RefreshControl } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { IconClockHour5, IconMessageCircle } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import usePost from "../../hooks/post/postHooks";
import CommentItem2 from "../../ui/comments/CommentItem2";
import AvatarUsername from "../../ui/common/AvatarUsername";
import CommunityLink from "../../ui/CommunityLink";
import ContentView from "../../ui/ContentView";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";
import LoadingView from "../../ui/Loading/LoadingView";
import PostActionBar from "./PostActionBar";
import { getUserFullName } from "../../../lemmy/LemmyHelpers";

function PostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const post = usePost(
    route.params && route.params.commentId ? route.params.commentId : null
  );

  const [showLoadAll, setShowLoadAll] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: `${post.currentPost?.counts.comments} Comment${
        post.currentPost?.counts.comments !== 1 ? "s" : ""
      }`,
    });
  }, []);

  const commentItem = useCallback(
    ({ item }) => (
      <CommentItem2
        nestedComment={item}
        opId={post.currentPost.creator.id}
        recycled={post.recycled}
      />
    ),
    []
  );

  const refreshControl = (
    <RefreshControl
      refreshing={post.commentsLoading}
      onRefresh={post.doLoad}
      tintColor={theme.colors.app.refreshWheel}
    />
  );

  if (!post) {
    return <LoadingView />;
  }

  const instanceBaseUrl = getBaseUrl(post.currentPost.creator.actor_id);

  const header = () => (
    <VStack flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
      <ContentView post={post.currentPost} showTitle showBody />

      <HStack mb={2} mx={4} space={2}>
        <AvatarUsername
          username={post.currentPost?.creator.name}
          fullUsername={getUserFullName(post.currentPost?.creator)}
          avatar={post.currentPost?.creator.avatar}
        />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <HStack alignItems="center">
          <CommunityLink
            community={post.currentPost?.community}
            instanceBaseUrl={!post.currentPost?.post.local && instanceBaseUrl}
            color={theme.colors.app.secondaryText}
          />
        </HStack>
        <HStack alignItems="center" space={1}>
          <IconMessageCircle size={14} color={theme.colors.app.secondaryText} />
          <Text color={theme.colors.app.secondaryText}>
            {post.currentPost.counts.comments}
          </Text>
        </HStack>
        <HStack alignItems="center" space={1}>
          <IconClockHour5 size={14} color={theme.colors.app.secondaryText} />
          <Text color={theme.colors.app.secondaryText}>
            {timeFromNowShort(post.currentPost?.post.published)}
          </Text>
        </HStack>
      </HStack>

      <Divider my={1} />
      <PostActionBar post={post} />
      <Divider />
      {route.params && route.params.commentId && showLoadAll && (
        <Pressable
          backgroundColor="#1A91FF"
          onPress={() => {
            setShowLoadAll(false);
            post.doLoad(true);
          }}
        >
          <VStack>
            <Text fontSize="md" fontStyle="italic" px={2} py={3}>
              Load all comments...
            </Text>
          </VStack>
        </Pressable>
      )}
    </VStack>
  );

  const footer = () => {
    if (post.commentsLoading) {
      return (
        <Center my={4}>
          <Spinner />
          <Text fontStyle="italic" color={theme.colors.app.secondaryText}>
            Loading comments...
          </Text>
        </Center>
      );
    }
    if (post.commentsError) {
      return (
        <LoadingErrorFooter
          onRetryPress={post.doLoad}
          message="Error loading comments 😢"
        />
      );
    }
    if (post.comments && post.comments.length === 0 && !post.commentsError) {
      return (
        <Center my={4}>
          <Text fontStyle="italic" color={theme.colors.app.secondaryText}>
            No comments yet. Time to do your part 🫡
          </Text>
        </Center>
      );
    }

    return null;
  };

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
        <FlashList
          ListFooterComponent={footer}
          ListHeaderComponent={header}
          extraData={post.refreshList}
          data={post.comments}
          renderItem={commentItem}
          keyExtractor={(item) => item.comment.comment.id.toString()}
          estimatedItemSize={200}
          refreshControl={refreshControl}
          refreshing={post.commentsLoading}
        />
      </VStack>
    );
  }
}

export default PostScreen;
