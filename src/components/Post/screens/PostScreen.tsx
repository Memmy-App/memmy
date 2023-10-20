import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAwaitTransition } from '@hooks/useAwaitTransition';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { YStack } from 'tamagui';

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
  const { postId, scrollToCommentId } = route.params;

  const awaitTransition = useAwaitTransition();

  const postCounts = usePostCounts(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);
  const postCommunityId = usePostCommunityId(postId);

  const newCommentId = useNewCommentId();

  const defaultSortType = useDefaultCommentSort();

  const [sortType, setSortType] = useState<CommentSortType>(
    defaultSortType ?? 'Top',
  );

  const flashListRef = useRef<FlashList<ICommentInfo>>();

  const commentsToShow = useMemo(() => {
    return !awaitTransition.transitioning
      ? postCommentsInfo?.filter((commentInfo) => commentInfo.showInPost)
      : [];
  }, [awaitTransition.transitioning, postCommentsInfo]);

  const { isLoading, isError } = useLoadData(async () => {
    return await instance.getComments(postId, postCommunityId ?? 0);
  });

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
  }, [sortType]);

  useEffect(() => {
    if (newCommentId == null) return;

    const index = commentsToShow?.findIndex(
      (c) => c.commentId === newCommentId,
    );

    if (index == null || index === -1) return;

    flashListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 80,
    });

    setNewCommentId(undefined);
  }, [newCommentId, commentsToShow]);

  useEffect(() => {
    if (!isLoading && scrollToCommentId != null) {
      const index = commentsToShow?.findIndex(
        (c) => c.commentId === scrollToCommentId,
      );

      if (index == null || index < 0) {
        return;
      }

      setTimeout(() => {
        flashListRef.current?.scrollToIndex({
          index,
          animated: true,
        });
      }, 100);
    }
  }, [isLoading]);

  if (postCommunityId == null) {
    return <LoadingScreen />;
  }

  return (
    <YStack flex={1}>
      <FlashList<ICommentInfo>
        renderItem={renderItem}
        data={commentsToShow}
        keyExtractor={keyExtractor}
        estimatedItemSize={100}
        ListHeaderComponent={<Post />}
        ListEmptyComponent={
          <FeedLoadingIndicator
            loading={isLoading || awaitTransition.transitioning}
            error={isError}
          />
        }
        // @ts-expect-error this is valid
        ref={flashListRef}
      />
    </YStack>
  );
}
