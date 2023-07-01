import React, { useEffect, useState } from "react";

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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { IconClockHour5, IconMessageCircle } from "tabler-icons-react-native";
import { CommentSortType } from "lemmy-js-client";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import usePost from "../../hooks/post/postHooks";
import CommentItem from "../../ui/comments/CommentItem";
import AvatarUsername from "../../ui/common/AvatarUsername";
import CommunityLink from "../../ui/CommunityLink";
import PostContentView from "./PostContentView";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";
import LoadingView from "../../ui/Loading/LoadingView";
import PostActionBar from "./PostActionBar";
import NoResultView from "../../ui/common/NoResultView";
import CommentSortButton from "./CommentSortButton";

function getCommentSortButton(
  sortType: string,
  setSortType: (type: string) => void
) {
  return <CommentSortButton sortType={sortType} setSortType={setSortType} />;
}

function PostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [showLoadAll, setShowLoadAll] = useState(true);
  const [sortType, setSortType] = useState("Top");

  const theme = useTheme();
  const post = usePost(
    route.params && route.params.commentId ? route.params.commentId : null,
    sortType as CommentSortType
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${post.currentPost?.counts.comments} Comment${
        post.currentPost?.counts.comments !== 1 ? "s" : ""
      }`,
      headerRight: () => getCommentSortButton(sortType, setSortType),
    });
  }, []);

  const commentItem = ({ item }) => (
    <CommentItem
      comment={item}
      setComments={post.setComments}
      opId={post.currentPost.creator.id}
    />
  );

  const refreshControl = (
    <RefreshControl
      refreshing={post.commentsLoading}
      onRefresh={post.doLoad}
      tintColor={theme.colors.app.textSecondary}
    />
  );

  if (!post) {
    return <LoadingView />;
  }

  const instanceBaseUrl = getBaseUrl(post.currentPost.community.actor_id);

  const header = (
    <VStack flex={1} backgroundColor={theme.colors.app.fg}>
      <PostContentView post={post.currentPost} />

      <HStack mb={2} mx={4} space={2}>
        <AvatarUsername creator={post.currentPost?.creator} showInstance />
      </HStack>
      <HStack space={2} mx={4} mb={2}>
        <HStack alignItems="center">
          <CommunityLink
            community={post.currentPost?.community}
            instanceBaseUrl={!post.currentPost?.post.local && instanceBaseUrl}
            color={theme.colors.app.textSecondary}
          />
        </HStack>
        <HStack alignItems="center" space={1}>
          <IconMessageCircle size={14} color={theme.colors.app.textSecondary} />
          <Text color={theme.colors.app.textSecondary}>
            {post.currentPost.counts.comments}
          </Text>
        </HStack>
        <HStack alignItems="center" space={1}>
          <IconClockHour5 size={14} color={theme.colors.app.textSecondary} />
          <Text color={theme.colors.app.textSecondary}>
            {timeFromNowShort(post.currentPost?.post.published)}
          </Text>
        </HStack>
      </HStack>

      <Divider my={1} bg={theme.colors.app.border} />
      <PostActionBar post={post} />
      <Divider bg={theme.colors.app.border} />
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
          <Text fontStyle="italic" color={theme.colors.app.textSecondary}>
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
    if (post.comments.length === 0 && !post.commentsError) {
      return <NoResultView my={4} type="comments" />;
    }

    return null;
  };

  const keyExtractor = (item) => item.comment.comment.id.toString();

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          ListFooterComponent={footer()}
          ListHeaderComponent={header}
          data={post.comments}
          renderItem={commentItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          refreshControl={refreshControl}
          refreshing={post.commentsLoading}
        />
      </VStack>
    );
  }
}

export default PostScreen;
