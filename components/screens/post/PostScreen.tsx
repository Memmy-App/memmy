import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
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
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import usePost from "../../hooks/post/postHooks";
import LoadingView from "../../ui/Loading/LoadingView";
import CommentItem from "../../ui/comments/CommentItem";
import CommentSortButton from "../../ui/post/CommentSortButton";
import PostActionBar from "./PostActionBar";
import PostOptionsButton from "../../ui/post/PostOptionsButton";
import PostFooter from "../../ui/post/PostFooter";
import PostHeader from "../../ui/post/PostHeader";
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
        <HStack space={3}>
          <PostOptionsButton postId={post.currentPost.post.id} />
          <CommentSortButton
            sortType={post.sortType}
            setSortType={post.setSortType}
          />
        </HStack>
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

  const keyExtractor = (item) => item.comment.comment.id.toString();

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          ListHeaderComponent={
            <PostHeader post={post} showLoadAll={route?.params?.showLoadAll} />
          }
          ListFooterComponent={<PostFooter post={post} />}
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
