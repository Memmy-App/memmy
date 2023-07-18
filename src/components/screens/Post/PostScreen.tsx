import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
import usePost from "../../../hooks/post/usePost";
import LoadingView from "../../common/Loading/LoadingView";
import CommentItem from "../../common/Comments/CommentItem";
import PostOptionsButton from "./components/PostOptionsButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import { PostsState, usePostsStore } from "../../../stores/posts/postsStore";
import { loadPostComments, removePost } from "../../../stores/posts/actions";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ navigation }: IProps) {
  const postHook = usePost();

  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    const commentCount = postHook.post.counts.comments || 0;
    navigation.setOptions({
      title: `${commentCount} ${t("Comment", { count: commentCount })}`,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HStack space={3}>
          {/* <CommentSortButton */}
          {/*  sortType={postHook.postState.sortType} */}
          {/*  setSortType={postHook.postState.setSortType} */}
          {/* /> */}
          <PostOptionsButton />
        </HStack>
      ),
    });
  }, [postHook.postState.sortType]);

  useEffect(() => {
    loadPostComments(postHook.postKey, {
      sortType: postHook.postState.sortType,
    }).then();

    // Remove the post when we are finished
    return () => {
      removePost(postHook.postKey);
    };
  }, []);

  useEffect(() => {
    usePostsStore.setState(
      produce((state: PostsState) => {
        state.posts[postHook.postKey].visibleComments =
          postHook.postState.visibleComments.filter((c) => !c.hidden);
      })
    );
  }, [postHook.postState.comments]);

  const commentItem = ({ item }: { item: ILemmyComment }) => (
    <CommentItem comment={item} />
  );

  const refreshControl = (
    <RefreshControl
      refreshing={postHook.postState.commentsLoading}
      onRefresh={postHook.doLoad}
    />
  );

  if (!postHook.post) {
    return <LoadingView />;
  }

  const keyExtractor = (item) => item.comment.comment.id.toString();

  if (postHook.post) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          ListHeaderComponent={<PostHeader />}
          ListFooterComponent={<PostFooter />}
          data={postHook.postState.comments}
          renderItem={commentItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          refreshControl={refreshControl}
          refreshing={postHook.postState.commentsLoading}
        />
      </VStack>
    );
  }
}

export default PostScreen;
