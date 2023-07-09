import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import usePost from "../../../hooks/post/postHooks";
import LoadingView from "../../common/Loading/LoadingView";
import CommentItem from "../../common/Comments/CommentItem";
import CommentSortButton from "./components/CommentSortButton";
import PostOptionsButton from "./components/PostOptionsButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import NextCommentFAB from "../../common/Buttons/NextCommentFAB";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

interface ViewToken<T = any> {
  item?: T;
  key: string;
  index: number | null;
  isViewable: boolean;
  timestamp: number;
}

type ViewableItemsChangedType<T> = {
  viewableItems: ViewToken<T>[];
  changed: ViewToken<T>[];
};

function PostScreen({ route, navigation }: IProps) {
  const theme = useTheme();
  const [commentIndex, setCommentIndex] = useState<number | undefined>(
    undefined
  );
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
    (info: ViewableItemsChangedType<ILemmyComment>) => {
      console.log(info.viewableItems[0]);

      const firstViewableId = info.viewableItems[0].key;
      const currentIndex = post.comments.findIndex(
        (c) => String(c.comment.comment.id) === firstViewableId
      );

      console.log("currentIndex", currentIndex);
      console.log(post.comments);
      const fuck = post.comments.slice(currentIndex, post.comments.length);
      console.log({ fuck });
      // .find((c) => c.comment.comment.path.split(".").length === 2).comment
      // .comment.id;

      const visibleIndex = info.viewableItems[0]?.isViewable
        ? info.viewableItems[0]?.index || 0
        : 0;
      console.log(visibleIndex);
      setCommentIndex(visibleIndex);
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
    const newIndex = commentIndex === undefined ? 0 : commentIndex + 1;
    flashListRef.current.scrollToIndex({ index: newIndex });
    setCommentIndex(newIndex);
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
