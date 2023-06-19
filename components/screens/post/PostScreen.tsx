import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Center,
  Divider,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import { RefreshControl, StyleSheet } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";
import moment from "moment/moment";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LoadingView from "../../ui/Loading/LoadingView";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/CommentItem";
import { setResponseTo } from "../../../slices/newComment/newCommentSlice";
import ContentView from "../../ui/ContentView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import CommunityLink from "../../ui/CommunityLink";
import { shareLink } from "../../../helpers/ShareHelper";
import usePost from "../../hooks/post/postHooks";
import { useAppDispatch } from "../../../store";
import LoadingErrorFooter from "../../ui/Loading/LoadingErrorFooter";

function PostScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();
  const post = usePost();
  const dispatch = useAppDispatch();
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: `${post.currentPost?.counts.comments} Comment${
        post.currentPost?.counts.comments !== 1 ? "s" : ""
      }`,
    });
  }, []);

  const commentItem = useCallback(
    ({ item }) => (
      <View style={styles.commentContainer}>
        <CommentItem comment={item} />
      </View>
    ),
    []
  );

  const onVotePress = (value: -1 | 0 | 1) => {
    post.doVote(value);
  };

  const onCommentPress = () => {
    dispatch(
      setResponseTo({
        post: post.currentPost,
      })
    );

    navigation.push("NewComment");
  };

  const onSharePress = () => {
    shareLink({
      link: post.currentPost.post.ap_id,
      title: post.currentPost.post.name,
    });
  };

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
      <HStack justifyContent="center" space={10} mb={2}>
        <IconButton
          icon={
            <Icon
              as={Ionicons}
              name="arrow-up-outline"
              size={6}
              onPress={() => onVotePress(1)}
              color={post.currentPost?.my_vote === 1 ? "white" : "blue.500"}
            />
          }
          backgroundColor={
            post.currentPost?.my_vote !== 1 ? "screen.800" : "green.500"
          }
          padding={2}
        />
        <IconButton
          icon={
            <Icon
              as={Ionicons}
              name="arrow-down-outline"
              size={6}
              onPress={() => onVotePress(-1)}
              color={post.currentPost?.my_vote === -1 ? "white" : "blue.500"}
            />
          }
          backgroundColor={
            post.currentPost?.my_vote !== -1 ? "screen.800" : "orange.500"
          }
          padding={2}
        />
        <IconButton
          icon={
            <Icon
              as={Ionicons}
              name={post.bookmarked ? "bookmark" : "bookmark-outline"}
              onPress={post.doBookmark}
            />
          }
        />
        <IconButton
          icon={<Icon as={Ionicons} name="arrow-undo-outline" />}
          onPress={onCommentPress}
        />
        <IconButton
          icon={<Icon as={Ionicons} name="share-outline" />}
          onPress={onSharePress}
        />
      </HStack>
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
    if (post.comments.length === 0 && !post.commentsError) {
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
      <VStack
        style={[
          styles.commentContainer,
          { backgroundColor: theme.colors.screen["800"] },
        ]}
      >
        <FlashList
          ListFooterComponent={footer}
          ListHeaderComponent={header}
          extraData={post.refreshList}
          data={post.comments}
          renderItem={commentItem}
          onEndReachedThreshold={0.8}
          keyExtractor={(item) => item.top.comment.id.toString()}
          estimatedItemSize={100}
          estimatedListSize={{
            height: 50,
            width: 1,
          }}
          onEndReached={() => setEndReached(true)}
          refreshControl={refreshControl}
          refreshing={post.commentsLoading}
          onMomentumScrollEnd={() => {
            if (endReached) {
              post.doLoad();
              setEndReached(false);
            }
          }}
        />
      </VStack>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    flex: 1,
  },
});

export default PostScreen;
