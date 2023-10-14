import { useCallback, useEffect, useRef, useState } from 'react';

interface UseLoadData<DataType = undefined> {
  refresh: (refreshFunc?: () => Promise<DataType>) => void;
  append: (appendFunc: () => Promise<DataType>) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error?: string;
  data?: DataType;
}

interface Status<DataType = undefined> {
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error?: string;
  data?: DataType;
}

export const useLoadData = <ReturnType>(
  func: () => Promise<ReturnType>,
  cacheFunc?: () => boolean,
): UseLoadData<ReturnType> => {
  const inProgress = useRef(false);

  const [status, setStatus] = useState<Status<ReturnType>>({
    isLoading: true,
    isRefreshing: false,
    isError: false,
    error: undefined,
    data: undefined,
  });

  useEffect(() => {
    if (cacheFunc != null) {
      const res = cacheFunc();

      if (res) {
        setStatus({
          ...status,
          isLoading: false,
          isError: false,
          error: undefined,
        });

        return;
      }
    }

    run(func);
  }, []);

  const run = useCallback(
    (func: () => Promise<ReturnType>, append = false, refresh = false) => {
      if (inProgress.current) return;

      inProgress.current = true;

      setStatus({
        ...status,
        isLoading: true,
        isError: false,
        isRefreshing: refresh,
        error: undefined,
      });

      void func()
        .then((data) => {
          if (append) {
            setStatus({
              ...status,
              isLoading: false,
              isError: false,
              isRefreshing: false,
              error: undefined,
            });
          } else {
            setStatus({
              isLoading: false,
              isError: false,
              isRefreshing: false,
              error: undefined,
              data,
            });
          }

          inProgress.current = false;
        })
        .catch((e) => {
          setStatus({
            isLoading: false,
            isError: true,
            isRefreshing: false,
            error: e.message,
          });

          inProgress.current = false;
        });
    },
    [status],
  );

  const refresh = useCallback((refreshFunc?: () => Promise<ReturnType>) => {
    if (refreshFunc == null) refreshFunc = func;

    run(refreshFunc, false, true);
  }, []);

  const append = useCallback((appendFunc: () => Promise<ReturnType>) => {
    run(appendFunc, true);
  }, []);

  return {
    ...status,
    refresh,
    append,
  };
};
