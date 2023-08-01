import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, VStack } from "@src/components/common/Gluestack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import { WritableDraft } from "immer/src/types/types-external";
import ShowMoreButton from "@src/components/common/Comments/ShowMoreButton";
import showAllInChain from "@src/stores/posts/actions/showAllInChain";
import { StyleSheet } from "react-native";
import { onGenericHapticFeedback } from "@src/helpers/HapticFeedbackHelpers";
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
  usePostOptions,
  usePostRerenderComments,
  usePostsStore,
} from "../../../stores/posts/postsStore";
import { removePost } from "../../../stores/posts/actions";
import {
  useEditedComment,
  useNewComment,
  useUpdatesStore,
} from "../../../stores/updates/updatesStore";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import PostCommentItem from "./components/PostCommentItem";
import usePost from "../../../hooks/post/usePost";
import CommentSortButton from "./components/CommentSortButton";
import refreshPost from "../../../stores/posts/actions/refreshPost";
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
  const options = usePostOptions(postKey);

  const commentsStatus = usePostCommentsStatus(postKey);

  const updates = useUpdatesStore();

  const viewableItems = useRef([]);
  const lastCommentId = useRef<number | null>(null);

  const [readyToScroll, setReadyToScroll] = useState(false);

  const { t } = useTranslation();
  const theme = useThemeOptions();
  const showJumpButton = useSettingsStore(
    (state) => state.settings.showCommentJumpButton
  );

  const flashListRef = useRef<FlashList<any>>(null);

  useEffect(() => {
    // get post to update unread_count
    refreshPost(postKey).then();

    return () => {
      removePost(postKey);
    };
  }, []);

  useEffect(() => {
    if (!commentsStatus.commentsLoading && options.initialCommentId) {
      const comment = comments.find(
        (c) => c.comment.comment.id === options.initialCommentId
      );

      // Make sure that the comment is rendered so that we can scroll to it
      const pathArr = comment.comment.comment.path.split(".");

      if (pathArr.length > 4) {
        showAllInChain(postKey, Number(pathArr[3]), "children");
      } else {
        showAllInChain(postKey, Number(pathArr[1]), "top");
      }

      setTimeout(() => setReadyToScroll(true), 500);
    }
  }, [commentsStatus.commentsLoading]);

  useEffect(() => {
    if (!readyToScroll) return;

    // Scroll to the comment
    // We have to get the item again in case anything changed
    const scrollToItem = visibleComments.find(
      (c) => c.comment.comment.id === options.initialCommentId
    );

    flashListRef.current.scrollToItem({
      animated: true,
      item: scrollToItem,
    });
  }, [readyToScroll]);

  useEffect(() => {
    postHook.doLoad();

    const commentCount = currentPost.counts.comments || 0;
    navigation.setOptions({
      title: `${commentCount} ${t("Comment", { count: commentCount })}`,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HStack space="md">
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
      viewableItems.current = info.viewableItems;
    },
    []
  );

  useEffect(() => {
    if (!newComment || !newComment.comment) return;

    // Create a new comment chain
    const lComment: ILemmyComment = {
      comment: newComment.comment,
      collapsed: false,
      hidden: false,
      myVote: newComment.comment.my_vote as ILemmyVote,
      showMoreChildren: false,
      showMoreTop: false,
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

    updates.clearNewComment();
  }, [newComment]);

  useEffect(() => {
    if (!editedComment) return;

    usePostsStore.setState((state) => {
      const prev = state.posts.get(postKey);
      const comment = prev.commentsState.comments.find(
        (c) => c.comment.comment.id === editedComment.commentId
      ) as WritableDraft<ILemmyComment>;

      comment.comment.comment.content = editedComment.content;
    });

    updates.clearEditedComment();
  }, [editedComment]);

  // Get the comments that are visible. Only recal whenever we trigger the render
  const visibleComments = useMemo(
    () =>
      comments.filter((c) => !c.hidden || c.showMoreTop || c.showMoreChildren),
    [rerenderComments]
  );

  // Comment item renderer
  const commentItem = useCallback(
    ({ item }) => {
      if (item.showMoreTop && item.hidden) {
        const pathArr = item.comment.comment.path.split(".");

        return (
          <ShowMoreButton
            type="top"
            commentId={Number(pathArr[1])}
            depth={pathArr.length}
          />
        );
      }

      if (item.showMoreChildren && item.hidden) {
        const pathArr = item.comment.comment.path.split(".");

        return (
          <ShowMoreButton
            type="children"
            commentId={Number(pathArr[pathArr.length - 2])}
            depth={pathArr.length}
          />
        );
      }

      return <PostCommentItem commentId={item.comment.comment.id} />;
    },
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
    onGenericHapticFeedback();

    // No viewable items
    if (viewableItems.current.length < 1) return;

    if (lastCommentId.current === null) {
      const nextItem = visibleComments[0];

      lastCommentId.current = nextItem.comment.comment.id;
      flashListRef.current.scrollToItem({ item: nextItem, animated: true });

      return;
    }

    const currentIndex = visibleComments.findIndex(
      (c) => c.comment.comment.id === lastCommentId.current
    );

    const nextItem = visibleComments
      .slice(currentIndex + 1)
      .find(
        (c) =>
          isParentComment(c as ILemmyComment) &&
          c.comment.comment.id !== lastCommentId.current
      );

    if (!nextItem) return;

    lastCommentId.current = nextItem.comment.comment.id;
    flashListRef.current.scrollToItem({ item: nextItem, animated: true });
  };

  if (currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.bg}>
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
          contentContainerStyle={styles.list}
        />
        {showJumpButton && (
          <NextCommentFAB onPress={onFabPress} onLongPress={() => {}} />
        )}
      </VStack>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 80,
  },
});

export default PostScreen;
