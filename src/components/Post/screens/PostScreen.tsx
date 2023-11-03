import React, { useCallback, useRef } from 'react';
import Post from '@components/Post/components/Post';
import { ICommentInfo, ViewableItemsChanged, ViewToken } from '@src/types';
import CommentChain from '@components/Comment/components/CommentChain';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { YStack } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { usePostScreen } from '@components/Post/hooks/usePostScreen';
import FAB, { FABRef } from '@components/Common/Button/FAB';
import { useShowCommentJumpButton } from '@src/state';

interface IPostScreenContext {
  refresh?: () => void;
  postCollapsed: boolean;
  setPostCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostScreenContext: React.Context<IPostScreenContext> =
  React.createContext<IPostScreenContext>({
    refresh: undefined,
    postCollapsed: false,
    setPostCollapsed: undefined,
  });

export const usePostScreenContext = (): IPostScreenContext =>
  React.useContext(PostScreenContext);

const viewabilityConfig = {};

const renderItem = ({
  item,
}: ListRenderItemInfo<ICommentInfo>): React.JSX.Element => {
  return <CommentChain commentInfo={item} />;
};

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function PostScreen(): React.JSX.Element {
  const showJumpButton = useShowCommentJumpButton();

  const {
    isLoading,
    isError,
    isRefreshing,
    refresh,

    postCommentsInfo,
    postCommunityId,
    postCollapsed,
    setPostCollapsed,

    flashListRef,
  } = usePostScreen();

  const fabRef = useRef<FABRef>(null);

  // Viewability
  const viewableItems = useRef<Array<ViewToken<ICommentInfo>> | undefined>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vi }: ViewableItemsChanged<ICommentInfo>) => {
      viewableItems.current = vi;
    },
    [],
  );

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  // FAB
  const lastCommentId = useRef<number | null>(null);

  const onScrollStart = useCallback(() => {
    fabRef.current?.setVisible(false);
  }, []);

  const onScrollEnd = useCallback(() => {
    fabRef.current?.setVisible(true);
  }, []);

  const onFabPress = useCallback(() => {
    // If there are no items do nothing
    if (postCommentsInfo == null || postCommentsInfo.length < 1) return;

    // Get the current index
    let currentIndex: number;

    if (
      lastCommentId.current == null ||
      viewableItems.current == null ||
      viewableItems.current.length < 1
    ) {
      currentIndex = -1;
    } else {
      const firstVisible = viewableItems.current[0].item;

      if (firstVisible == null) return;

      currentIndex = postCommentsInfo.findIndex(
        (c) => c.commentId === firstVisible.commentId,
      );
    }

    // Get the next item
    const nextItem = postCommentsInfo
      .slice(currentIndex + 1)
      .find((c) => c.depth === 0 && c.commentId !== lastCommentId.current);

    // If no item was found, return
    if (nextItem == null) return;

    lastCommentId.current = nextItem.commentId;
    flashListRef.current?.scrollToItem({ item: nextItem, animated: true });
  }, [postCommentsInfo]);

  const onFabLongPress = useCallback(() => {
    // If there isn't a last comment, return
    if (lastCommentId.current == null || postCommentsInfo == null) return;

    const lastCommentIndex = postCommentsInfo?.findIndex(
      (c) => c.commentId === lastCommentId.current,
    );

    const reversedComments = postCommentsInfo
      .slice(0, lastCommentIndex)
      .reverse();

    const prevItemIndex = reversedComments.findIndex(
      (c) => c.depth === 0 && c.commentId !== lastCommentId.current,
    );

    if (prevItemIndex === -1) return;

    flashListRef.current?.scrollToItem({
      item: reversedComments[prevItemIndex],
      animated: true,
    });

    const nextLastItem = reversedComments
      .slice(prevItemIndex)
      .find((c) => c.depth === 0 && c.commentId !== lastCommentId.current);

    if (nextLastItem == null) lastCommentId.current = null;
    else lastCommentId.current = nextLastItem.commentId;
  }, [postCommentsInfo]);

  if (postCommunityId == null) {
    return <LoadingScreen />;
  }

  return (
    <PostScreenContext.Provider
      value={{
        refresh,
        postCollapsed,
        setPostCollapsed,
      }}
    >
      <YStack flex={1}>
        <FlashList<ICommentInfo>
          renderItem={renderItem}
          data={postCommentsInfo}
          keyExtractor={keyExtractor}
          estimatedItemSize={100}
          ListHeaderComponent={<Post />}
          onScrollBeginDrag={onScrollStart}
          onScrollEndDrag={onScrollEnd}
          ListEmptyComponent={
            <FeedLoadingIndicator
              loading={isLoading && !isRefreshing}
              error={isError}
              empty={postCommentsInfo != null && postCommentsInfo.length < 1}
            />
          }
          refreshControl={
            <RefreshControl onRefresh={refresh} refreshing={isRefreshing} />
          }
          // @ts-expect-error this is valid
          ref={flashListRef}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
        {showJumpButton && (
          <FAB onPress={onFabPress} onLongPress={onFabLongPress} ref={fabRef} />
        )}
      </YStack>
    </PostScreenContext.Provider>
  );
}
