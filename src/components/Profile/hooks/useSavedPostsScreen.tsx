import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/core';

interface UseSavedPostsScreen {
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  onEndReached: () => void;
  refresh: () => void;
}

export const useSavedPostsTab = (): UseSavedPostsScreen => {
  const { key } = useRoute();

  const [nextPage, setNextPage] = useState<number>(1);

  useEffect(() => {}, []);

  const { isLoading, isRefreshing, isError, append, refresh } = useLoadData(
    async () => {
      await instance.getSavedPosts({
        page: 1,
        refresh: true,
        screenId: key,
      });

      setNextPage(2);
    },
  );

  const onEndReached = useCallback(() => {
    append(async () => {
      await instance.getSavedPosts({
        page: nextPage,
        screenId: key,
      });

      setNextPage((prev) => prev + 1);
    });
  }, [nextPage]);

  return {
    isLoading,
    isRefreshing,
    isError,
    onEndReached,
    refresh,
  };
};
