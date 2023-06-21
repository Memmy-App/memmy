import React, { useCallback, useEffect } from "react";

import {
  Center,
  Divider,
  HStack,
  Spinner,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { RefreshControl } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { IconClockHour5 } from "tabler-icons-react-native";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { timeFromNowShort } from "../../../helpers/TimeHelper";
import usePost from "../../hooks/post/postHooks";
import CommentItem2 from "../../ui/CommentItem2";
import CommunityLink from "../../ui/CommunityLink";
import ContentView from "../../ui/ContentView";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";
import LoadingView from "../../ui/Loading/LoadingView";
import AvatarUsername from "../../ui/common/AvatarUsername";
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
    <VStack flex={1} backgroundColor={theme.colors.screen[800]}>
      <ContentView post={post.currentPost} showTitle showBody />

      <HStack mb={2} mx={4} space={2}>
        <HStack alignItems="center">
          <AvatarUsername
            username={post.currentPost?.creator.name}
            avatar={post.currentPost?.creator.avatar}
          />
          <Text> to </Text>
          <CommunityLink community={post.currentPost?.community} />
          {post.currentPost?.post.url && (
            <Text
              fontSize="sm"
              fontStyle="italic"
              mx={4}
              mt={-1}
              color="screen.400"
              alignSelf="flex-end"
            >
              @{getBaseUrl(post.currentPost?.post.url)}
            </Text>
          )}
        </HStack>

        <HStack space={1} alignItems="center">
          <IconClockHour5 size={14} color={theme.colors.app.secondaryText} />
          <Text>{timeFromNowShort(post.currentPost?.post.published)}</Text>
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
