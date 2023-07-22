import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { WritableDraft } from "immer/src/types/types-external";
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
import NextCommentFAB from "../../common/Buttons/NextCommentFAB";

interface ViewToken<T = any> {
  item?: T;
  key: string;
  index: number | null;
  isViewable: boolean;
  timestamp: number;
}

type ViewableItemsChangedType<T> = {
  viewableItems?: ViewToken<T>[];
  changed: ViewToken<T>[];
};

function isParentComment(commentItem: ILemmyComment) {
  return commentItem.comment.comment.path.split(".").length === 2;
}

function isComment(commentItem) {
  return typeof commentItem !== "string" && typeof commentItem !== "number";
}

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
  const firstViewableId = useRef(undefined);

  const [nextCommentPressed, setNextCommentPressed] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const flashListRef = useRef(null);

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

  const onViewableItemsChanged = useCallback(
    (info?: ViewableItemsChangedType<ILemmyComment>) => {
      const firstItem = info.viewableItems ? info.viewableItems[0] : null;
      if (!!firstItem && !!firstItem.item) {
        // Not sure if this is the right way to do this
        // Checking if the first item is a parent comment,
        // We don't want to set firstViewableId to a child comment I think? idk
        if (isParentComment(firstItem.item)) {
          firstViewableId.current =
            firstItem.item.comment.comment.id.toString();
        }
      }
    },
    []
  );

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
        (c) =>
          isComment(c) && (c as ILemmyComment).comment.comment.id === searchId
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
        (c) =>
          isComment(c) &&
          (c as ILemmyComment).comment.comment.id === editedComment.commentId
      ) as WritableDraft<ILemmyComment>;

      comment.comment.comment.content = editedComment.content;
    });

    clearEditComment();
  }, [editedComment]);

  // Get the comments that are visible. Only recal whenever we trigger the render
  const visibleComments = useMemo(
    () => comments.filter((c) => isComment(c) && !(c as ILemmyComment).hidden),
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
        onRefresh={postHook.doRefresh}
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

  const onFabPress = () => {
    // console.log("click", firstViewableId);
    const currentIndex = visibleComments.findIndex(
      (c) =>
        isComment(c) &&
        String((c as ILemmyComment).comment.comment.id) ===
          firstViewableId.current
    );
    if (!nextCommentPressed && currentIndex === 0) {
      setNextCommentPressed(true);
      flashListRef.current.scrollToIndex({ index: 0, animated: true });
      return;
    }

    const nextItem = visibleComments
      .slice(currentIndex + 1, visibleComments.length)
      .find((c) => isComment(c) && isParentComment(c as ILemmyComment));

    flashListRef.current.scrollToItem({ item: nextItem, animated: true });
  };

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
          onViewableItemsChanged={onViewableItemsChanged}
          ref={flashListRef}
        />
        <NextCommentFAB onPress={onFabPress} onLongPress={() => {}} />
      </VStack>
    );
  }
}

export default PostScreen;
