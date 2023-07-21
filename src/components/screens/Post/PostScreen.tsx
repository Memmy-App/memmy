import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import LoadingView from "../../common/Loading/LoadingView";
import PostOptionsButton from "./components/PostOptionsButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import {
  useCurrentPost,
  usePostComments,
  usePostCommentsSort,
  usePostCommentsStatus,
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
import usePost from "../../../hooks/post/usePost";
import CommentSortButton from "./components/CommentSortButton";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ navigation }: IProps) {
  const { postKey } = useRoute<any>().params;
  const postHook = usePost();
  const currentPost = useCurrentPost(postKey);
  const newComment = useNewComment();
  const editedComment = useEditedComment();
  const rerenderComments = usePostRerenderComments(postKey);
  const commentsSort = usePostCommentsSort(postKey);
  const comments = usePostComments(postKey);
  const commentsStatus = usePostCommentsStatus(postKey);

  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    postHook.doLoad();

    const commentCount = currentPost.counts.comments || 0;
    navigation.setOptions({
      title: `${commentCount} ${t("Comment", { count: commentCount })}`,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HStack space={3}>
          <CommentSortButton
            sortType={commentsSort}
            setSortType={postHook.setPostCommentsSort}
          />
          <PostOptionsButton />
        </HStack>
      ),
    });
  }, [commentsSort]);

  useEffect(
    () =>
      // Remove the post when we are finished
      () => {
        removePost(postKey);
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
      usePostsStore.setState((state) => {
        const prev = state.posts.get(postKey);

        prev.commentsState.comments = [
          lComment,
          ...prev.commentsState.comments,
        ];
        prev.rerenderComments = !prev.rerenderComments;
      });
    } else {
      const pathArr = newComment.comment.comment.path.split(".");
      const searchId = Number(pathArr[pathArr.length - 2]);
      const index = comments.findIndex(
        (c) => c.comment.comment.id === searchId
      );

      usePostsStore.setState((state) => {
        const prev = state.posts.get(postKey);

        prev.commentsState.comments = [
          ...prev.commentsState.comments.slice(0, index + 1),
          lComment,
          ...prev.commentsState.comments.slice(index + 1),
        ];
        prev.rerenderComments = !prev.rerenderComments;
      });
    }

    clearNewComment();
  }, [newComment]);

  useEffect(() => {
    if (!editedComment) return;

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey);
      const comment = prev.commentsState.comments.find(
        (c) => c.comment.comment.id === editedComment.commentId
      );

      comment.comment.comment.content = editedComment.content;
    });

    clearEditComment();
  }, [editedComment]);

  // Get the comments that are visible. Only recal whenever we trigger the render
  const visibleComments = useMemo(
    () => comments.filter((c) => !c.hidden),
    [rerenderComments]
  );

  // Comment item renderer
  const commentItem = useCallback(
    ({ item }) => <PostCommentItem commentId={item.comment.comment.id} />,
    [currentPost.post.id]
  );

  // Refresh control
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={commentsStatus.commentsLoading}
        onRefresh={postHook.doLoad}
      />
    ),
    [commentsStatus.commentsLoading]
  );

  const keyExtractor = useCallback(
    (item) => item.comment.comment.id.toString(),
    []
  );

  if (!currentPost) {
    return <LoadingView />;
  }

  if (currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          ListHeaderComponent={<PostHeader />}
          ListFooterComponent={<PostFooter />}
          data={visibleComments}
          renderItem={commentItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={100}
          refreshControl={refreshControl}
          refreshing={commentsStatus.commentsLoading}
        />
      </VStack>
    );
  }
}

export default PostScreen;
