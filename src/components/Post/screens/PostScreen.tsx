import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  setNewCommentId,
  useDefaultCommentSort,
  useNewCommentId,
  usePostCommentsInfo,
  usePostCommunityId,
  usePostCounts,
} from '@src/state';
import Post from '@components/Post/components/Post';
import instance from '@src/Instance';
import { ICommentInfo } from '@src/types';
import CommentChain from '@components/Comment/components/CommentChain';
import { useLoadData } from '@hooks/useLoadData';
import FeedLoadingIndicator from '@components/Feed/components/Feed/FeedLoadingIndicator';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommentSortType } from 'lemmy-js-client';
import { stripEss } from '@helpers/text';
import CommentSortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/CommentSortTypeContextMenuButton';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { YStack } from 'tamagui';
import RefreshControl from '@components/Common/Gui/RefreshControl';

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

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<ICommentInfo>): React.JSX.Element => {
  return <CommentChain commentInfo={item} />;
};

const keyExtractor = (item: ICommentInfo): string => item.commentId.toString();

export default function PostScreen({
  navigation,
  route,
}: IProps): React.JSX.Element {
  const { postId, parentCommentId } = route.params;

  const [postCollapsed, setPostCollapsed] = useState<boolean>(
    parentCommentId != null,
  );
  const postCounts = usePostCounts(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);
  const postCommunityId = usePostCommunityId(postId);

  const newCommentId = useNewCommentId();

  const defaultSortType = useDefaultCommentSort();

  const initialized = useRef(false);

  const [sortType, setSortType] = useState<CommentSortType>(
    defaultSortType ?? 'Top',
  );

  const flashListRef = useRef<FlashList<ICommentInfo>>();

  const { isLoading, isError, isRefreshing, refresh } = useLoadData(
    async () => {
      await instance.getComments({
        options: {
          post_id: postId,
          community_id: postCommunityId ?? undefined,
          sort: sortType,
          parent_id: parentCommentId ?? undefined,
          ...(parentCommentId != null && {
            max_depth: 10,
          }),
        },
        ignoreDepth: parentCommentId != null,
      });

      if (parentCommentId != null) {
        flashListRef.current?.scrollToEnd({ animated: true });
      }

      initialized.current = true;
    },
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${postCounts?.comments} ${stripEss(
        postCounts?.comments,
        'Comments',
      )}`,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CommentSortTypeContextMenuButton
          sortType={sortType}
          setSortType={setSortType}
        />
      ),
    });

    if (!initialized.current) return;

    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });

    refresh(async () => {
      await instance.getComments({
        options: {
          post_id: postId,
          community_id: postCommunityId ?? undefined,
          sort: sortType,
        },
      });
    });
  }, [sortType]);

  useEffect(() => {
    if (newCommentId == null) return;

    const index = postCommentsInfo?.findIndex(
      (c) => c.commentId === newCommentId,
    );

    if (index == null || index === -1) return;

    flashListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 80,
    });

    setNewCommentId(undefined);
  }, [newCommentId, postCommentsInfo]);

  const onRefresh = useCallback(() => {
    refresh(async () => {
      await instance.getComments({
        options: {
          post_id: postId,
          community_id: postCommunityId ?? undefined,
          sort: sortType,
        },
      });
    });
  }, []);

  if (postCommunityId == null) {
    return <LoadingScreen />;
  }

  return (
    <PostScreenContext.Provider
      value={{
        refresh: onRefresh,
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
            <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
          }
          // @ts-expect-error this is valid
          ref={flashListRef}
        />
      </YStack>
    </PostScreenContext.Provider>
  );
}
