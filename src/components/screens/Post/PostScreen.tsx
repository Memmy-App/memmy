import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import usePost from "../../../hooks/post/postHooks";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import NextCommentFAB from "../../common/Buttons/NextCommentFAB";
import CommentItem from "../../common/Comments/CommentItem";
import LoadingView from "../../common/Loading/LoadingView";
import RefreshControl from "../../common/RefreshControl";
import CommentSortButton from "./components/CommentSortButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import PostOptionsButton from "./components/PostOptionsButton";

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
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ route, navigation }: IProps) {
  const theme = useTheme();
  const [firstViewableId, setFirstViewableId] = useState<
    string | null | undefined
  >(undefined);
  const [nextCommentPressed, setNextCommentPressed] = useState(false);
  const post = usePost(
    route.params && route.params.commentId ? route.params.commentId : null
  );

  const flashListRef = useRef(null);

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

  const onViewableItemsChanged = useCallback(
    (info?: ViewableItemsChangedType<ILemmyComment>) => {
      const firstItem = info.viewableItems ? info.viewableItems[0] : null;
      if (!!firstItem && !!firstItem.item) {
        // Not sure if this is the right way to do this
        // Checking if the first item is a parent comment,
        // We don't want to set firstViewableId to a child comment I think? idk
        if (isParentComment(firstItem.item)) {
          setFirstViewableId(firstItem.item.comment.comment.id.toString());
        }
      }
    },
    []
  );

  const commentItem = ({ item }: { item: ILemmyComment }) => (
    <CommentItem
      comment={item}
      setComments={post.setComments}
      opId={post.currentPost.creator.id}
    />
  );

  const refreshControl = (
    <RefreshControl refreshing={post.commentsLoading} onRefresh={post.doLoad} />
  );

  if (!post) {
    return <LoadingView />;
  }

  const keyExtractor = (item) => item.comment.comment.id.toString();

  const onFabPress = () => {
    // console.log("click", firstViewableId);
    const currentIndex = post.comments.findIndex(
      (c) => String(c.comment.comment.id) === firstViewableId
    );
    if (!nextCommentPressed && currentIndex === 0) {
      setNextCommentPressed(true);
      flashListRef.current.scrollToIndex({ index: 0, animated: true });
      return;
    }

    const nextItem = post.comments
      .slice(currentIndex + 1, post.comments.length)
      .find((c) => isParentComment(c));

    console.log({ nextItem });

    flashListRef.current.scrollToItem({ item: nextItem, animated: true });
  };

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          onViewableItemsChanged={onViewableItemsChanged}
          ref={flashListRef}
          ListHeaderComponent={
            <PostHeader post={post} showLoadAll={route?.params?.showLoadAll} />
          }
          ListFooterComponent={<PostFooter post={post} />}
          data={post.visibleComments}
          renderItem={commentItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={200}
          refreshControl={refreshControl}
          refreshing={post.commentsLoading}
        />
        <NextCommentFAB onPress={onFabPress} onLongPress={() => {}} />
      </VStack>
    );
  }
}

export default PostScreen;
