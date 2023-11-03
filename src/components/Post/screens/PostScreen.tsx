import React from 'react';
import Post from '@components/Post/components/Post';
import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Comment/components/CommentChain';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { YStack } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';
import { usePostScreen } from '@components/Post/hooks/usePostScreen';

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

const renderItem = ({
  item,
}: ListRenderItemInfo<ICommentInfo>): React.JSX.Element => {
  return <CommentChain commentInfo={item} />;
};

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function PostScreen(): React.JSX.Element {
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
        />
      </YStack>
    </PostScreenContext.Provider>
  );
}
