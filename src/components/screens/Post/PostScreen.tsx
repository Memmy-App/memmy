import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { HStack, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePost from "../../../hooks/post/postHooks";
import LoadingView from "../../common/Loading/LoadingView";
import CommentItem from "../../common/Comments/CommentItem";
import CommentSortButton from "./components/CommentSortButton";
import PostOptionsButton from "./components/PostOptionsButton";
import PostFooter from "./components/PostFooter";
import PostHeader from "./components/PostHeader";
import RefreshControl from "../../common/RefreshControl";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function PostScreen({ route, navigation }: IProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const post = usePost(
    route.params && route.params.commentId ? route.params.commentId : null
  );

  useEffect(() => {
    const commentCount = post.currentPost?.counts.comments || 0;
    navigation.setOptions({
      title: `${commentCount} ${t("Comment", { count: commentCount })}`,
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

  if (post.currentPost) {
    return (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <FlashList
          ListHeaderComponent={
            <PostHeader
              currentPost={post.currentPost}
              collapsed={post.collapsed}
              setCollapsed={post.setCollapsed}
              doLoad={post.doLoad}
              doSave={post.doSave}
              doVote={post.doVote}
              showLoadAll={route?.params?.showLoadAll}
            />
          }
          ListFooterComponent={<PostFooter post={post} />}
          data={post.visibleComments}
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
