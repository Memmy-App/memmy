import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { produce } from "immer";
import usePost from "../../../hooks/post/usePost";
import LoadingView from "../../common/Loading/LoadingView";
import PostOptionsButton from "./components/PostOptionsButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import {
  PostsStore,
  usePostRerenderComments,
  usePostsStore,
} from "../../../stores/posts/postsStore";
import { removePost } from "../../../stores/posts/actions";
import {
  useEditedComment,
  useNewComment,
} from "../../../stores/updates/updatesStore";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import { clearEditComment } from "../../../slices/comments/editCommentSlice";
import { clearNewComment } from "../../../slices/comments/newCommentSlice";
import PostCommentItem from "./components/PostCommentItem";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ navigation }: IProps) {
  const postHook = usePost();
  const newComment = useNewComment();
  const editedComment = useEditedComment();
  const rerenderComments = usePostRerenderComments(postHook.postKey);

  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    postHook.doLoad();

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
  }, [postHook.commentsState.commentsSort]);

  useEffect(
    () =>
      // Remove the post when we are finished
      () => {
        removePost(postHook.postKey);
      },
    []
  );

  useEffect(() => {
    if (!newComment) return;

    // Create a new comment chain
    const lComment: ILemmyComment = {
      comment: newComment.comment,
      collapsed: false,
      hidden: false,
      myVote: newComment.comment.my_vote as ILemmyVote,
    };
    // If it's a top comment, add it to top of current chain
    if (newComment.isTop) {
      usePostsStore.setState(
        produce((state: PostsStore) => {
          state.posts[postHook.postKey].comments = [
            lComment,
            ...state.posts[postHook.postKey].comments,
          ];
        })
      );
    } else {
      const pathArr = newComment.comment.comment.path.split(".");
      const searchId = Number(pathArr[pathArr.length - 2]);
      const index = postHook.commentsState.comments.findIndex(
        (c) => c.comment.comment.id === searchId
      );

      usePostsStore.setState(
        produce((state: PostsStore) => {
          state.posts[postHook.postKey].comments = [
            ...state.posts[postHook.postKey].comments.slice(0, index + 1),
            lComment,
            ...state.posts[postHook.postKey].comments.slice(index + 1),
          ];
        })
      );
    }

    clearNewComment();
  }, [newComment]);

  useEffect(() => {
    if (!editedComment) return;

    console.log(editedComment);

    usePostsStore.setState(
      produce((state: PostsStore) => {
        state.posts[postHook.postKey].comments = state.posts[
          postHook.postKey
        ].comments.map((c) => {
          if (c.comment.comment.id !== editedComment.commentId) return c;

          return {
            ...c,
            comment: {
              ...c.comment,
              comment: {
                ...c.comment.comment,
                content: editedComment.content,
              },
            },
          };
        });
      })
    );

    clearEditComment();
  }, [editedComment]);

  const visibleComments = useMemo(
    () => postHook.commentsState.comments.filter((c) => !c.hidden),
    [rerenderComments]
  );

  const commentItem = useCallback(
    ({ item }) => <PostCommentItem commentId={item.comment.comment.id} />,
    [postHook.post.post.id]
  );

  const refreshControl = (
    <RefreshControl
      refreshing={postHook.commentsState.commentsLoading}
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
          data={visibleComments}
          renderItem={commentItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          refreshControl={refreshControl}
          refreshing={postHook.commentsState.commentsLoading}
        />
      </VStack>
    );
  }
}

export default PostScreen;
