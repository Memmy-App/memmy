import React, { useCallback, useEffect } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  Center,
  Divider,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { RefreshControl } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import moment from "moment/moment";
import LoadingView from "../../ui/Loading/LoadingView";
import ContentView from "../../ui/ContentView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import usePost from "../../hooks/post/postHooks";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";
import CommentItem2 from "../../ui/CommentItem2";
import CommunityLink from "../../ui/CommunityLink";
import PostActionBar from "./PostActionBar";

function PostScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();
  const post = usePost();

  useEffect(() => {
    navigation.setOptions({
      title: `${post.currentPost?.counts.comments} Comment${
        post.currentPost?.counts.comments !== 1 ? "s" : ""
      }`,
    });
  }, []);

  const commentItem = useCallback(
    ({ item }) => <CommentItem2 nestedComment={item} />,
    []
  );

  const refreshControl = (
    <RefreshControl
      refreshing={post.commentsLoading}
      onRefresh={post.doLoad}
      tintColor={theme.colors.screen[300]}
    />
  );

  if (!post) {
    return <LoadingView />;
  }

  const header = () => (
    <VStack flex={1} backgroundColor="screen.800">
      <ContentView post={post.currentPost} showBody showTitle />

      <HStack mx={4} mb={1}>
        <Text>in </Text>
        <CommunityLink community={post.currentPost?.community} />
        <Text> by </Text>
        <Text fontWeight="bold">{post.currentPost?.creator.name}</Text>

        <Text
          fontSize="sm"
          fontStyle="italic"
          mx={4}
          mt={-1}
          color="screen.400"
          alignSelf="flex-end"
        >
          {post.currentPost?.post.url && getBaseUrl(post.currentPost?.post.url)}
        </Text>
      </HStack>
      <HStack mx={3} space={2} alignItems="center" mb={3}>
        <HStack space={1} alignItems="center">
          {post.currentPost.counts.upvotes -
            post.currentPost.counts.downvotes >=
          0 ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )}
          <Text>
            {post.currentPost.counts.upvotes -
              post.currentPost.counts.downvotes}
          </Text>
        </HStack>
        <HStack space={1} alignItems="center">
          <Icon as={Ionicons} name="chatbubble-outline" />
          <Text>{post.currentPost?.counts.comments}</Text>
        </HStack>
        <HStack space={1} alignItems="center">
          <Icon as={Ionicons} name="time-outline" />
          <Text>
            {moment(post.currentPost?.post.published).utc(true).fromNow()}
          </Text>
        </HStack>
      </HStack>
      <Divider my={1} />
      <PostActionBar post={post} />
      <Divider />
    </VStack>
  );

  const footer = () => {
    if (post.commentsLoading) {
      return (
        <Center my={4}>
          <Spinner />
          <Text fontStyle="italic" color="gray.500">
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
          <Text fontStyle="italic" color="gray.500">
            No comments yet. Time to do your part 🫡
          </Text>
        </Center>
      );
    }

    return null;
  };

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.screen["800"]}>
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
