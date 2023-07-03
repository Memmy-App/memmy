import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import {
  Center,
  Divider,
  HStack,
  Pressable,
  Spinner,
  Text,
  VStack,
  useTheme,
} from "native-base";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import usePost from "../../hooks/post/postHooks";
import CommunityLink from "../../ui/CommunityLink";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";
import LoadingView from "../../ui/Loading/LoadingView";
import CommentItem from "../../ui/comments/CommentItem";
import AvatarUsername from "../../ui/common/AvatarUsername";
import CommentCount from "../../ui/common/CommentCount";
import DatePublished from "../../ui/common/DatePublished";
import NoResultView from "../../ui/common/NoResultView";
import CommentSortButton from "../../ui/post/CommentSortButton";
import PostActionBar from "./PostActionBar";
import PostContentView from "./PostContentView";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ route, navigation }: IProps) {

  const theme = useTheme();
  const post = usePost(
    route.params && route.params.commentId ? route.params.commentId : null
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${post.currentPost?.counts.comments} Comment${
        post.currentPost?.counts.comments !== 1 ? "s" : ""
      }`,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <CommentSortButton
          sortType={post.sortType}
          setSortType={post.setSortType}
        />
      ),
    });
  }, [post.sortType]);

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
        <CommunityLink
          community={post.currentPost?.community}
          instanceBaseUrl={instanceBaseUrl}
          color={theme.colors.app.textSecondary}
        />
        <CommentCount commentCount={post.currentPost.counts.comments} />
        <DatePublished published={post.currentPost?.post.published} />
      </HStack>

      <Divider my={1} bg={theme.colors.app.border} />
      <PostActionBar post={post} />
      <Divider bg={theme.colors.app.border} />
      {route.params && route.params.commentId && post.showLoadAll && (
        <Pressable
          backgroundColor="#1A91FF"
          onPress={() => {
            post.setShowLoadAll(false);
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
