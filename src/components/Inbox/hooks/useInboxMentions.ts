import { CommentView } from 'lemmy-js-client';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { addComments } from '@src/state';
import { useCallback, useMemo } from 'react';

interface UseInboxMentions {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  data?: CommentView[];
  doLoad: () => void;
}

export const useInboxMentions = (): UseInboxMentions => {
  const { isLoading, isError, data, refresh } = useLoadData<CommentView[]>();

  const isEmpty = useMemo(() => {
    return data == null || data.length < 1;
  }, [data]);

  const doLoad = useCallback(() => {
    refresh(async () => {
      const res = await instance.getMentions();

      addComments(res.mentions);

      return res.mentions;
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
