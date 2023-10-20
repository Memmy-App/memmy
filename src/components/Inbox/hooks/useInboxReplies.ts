import { CommentView } from 'lemmy-js-client';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { addComments } from '@src/state';
import { useCallback, useMemo } from 'react';

interface UseInboxReplies {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  data?: CommentView[];
  doLoad: () => void;
}

export const useInboxReplies = (): UseInboxReplies => {
  const { isLoading, isError, data, refresh } = useLoadData<CommentView[]>();

  const isEmpty = useMemo(() => {
    return data == null || data.length < 1;
  }, [data]);

  const doLoad = useCallback(() => {
    refresh(async () => {
      const res = await instance.getReplies();

      addComments(res.replies);

      return res.replies;
    });
  }, []);

  return {
    isLoading,
    isError,
    isEmpty,
    data,
    doLoad,
  };
};
