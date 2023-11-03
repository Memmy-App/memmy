import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import {
  setNewCommentId,
  useDefaultCommentSort,
  useNewCommentId,
  usePostCommentsInfo,
  usePostCommunityId,
  usePostCounts,
} from '@src/state';
import { stripEss } from '@helpers/text';
import CommentSortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/CommentSortTypeContextMenuButton';
import { CommentSortType } from 'lemmy-js-client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ICommentInfo } from '@src/types';

interface UsePostScreen {
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  refresh: () => void;

  postCommentsInfo?: ICommentInfo[];
  postCommunityId?: number;
  postCollapsed: boolean;
  setPostCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;

  flashListRef: React.RefObject<FlatList | undefined>;
}

export const usePostScreen = (): UsePostScreen => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { postId, parentCommentId } = route.params;

  const postCounts = usePostCounts(postId);
  const postCommentsInfo = usePostCommentsInfo(postId);
  const postCommunityId = usePostCommunityId(postId);

  const defaultSortType = useDefaultCommentSort();

  const newCommentId = useNewCommentId();

  const initialized = useRef(false);
  const flashListRef = useRef<FlatList | undefined>();

  const [sortType, setSortType] = useState<CommentSortType>(
    defaultSortType ?? 'Top',
  );
  const [postCollapsed, setPostCollapsed] = useState<boolean>(
    parentCommentId != null,
  );

  /**
   * Initial use effect for setting the title
   */
  useEffect(() => {
    navigation.setOptions({
      title: `${postCounts?.comments} ${stripEss(
        postCounts?.comments,
        'Comments',
      )}`,
    });
  }, []);

  /**
   * useEffect to refetch whenever we change the comment sort
   */
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

  /**
   * useEffect to scroll to a particular comment whenever create a new comment
   */
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

  /**
   * Refresh function. Different in that if we refresh we don't want to use the screen's params.
   */
  const onRefresh = useCallback(() => {
    refresh(async () => {
      await instance.getComments({
        options: {
          post_id: postId,
          community_id: postCommunityId ?? undefined,
          sort: sortType,
        },
      });

      // Refresh the post once we are done. No need to await.
      void instance.getPost({ postId });
    });
  }, []);

  const { isLoading, isError, isRefreshing, refresh } = useLoadData(
    async () => {
      // Fetch the comments
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

      // Refresh the post once we are done. No need to await.
      void instance.getPost({ postId });

      if (parentCommentId != null) {
        flashListRef.current?.scrollToEnd({ animated: true });
      }

      initialized.current = true;
    },
  );

  return {
    isLoading,
    isError,
    isRefreshing,
    refresh: onRefresh,

    postCommentsInfo,
    postCommunityId,
    postCollapsed,
    setPostCollapsed,

    flashListRef,
  };
};
