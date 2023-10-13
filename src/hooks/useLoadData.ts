import { useCallback, useEffect, useState } from 'react';

interface UseLoadData<DataType = undefined> {
  refresh: (refreshFunc?: () => Promise<DataType>) => void;
  append: (appendFunc: () => Promise<DataType>) => void;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  data?: DataType;
}

interface Status<DataType = undefined> {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  data?: DataType;
}

export const useLoadData = <ReturnType>(
  func: () => Promise<ReturnType>,
): UseLoadData<ReturnType> => {
  const [status, setStatus] = useState<Status<ReturnType>>({
    isLoading: true,
    isError: false,
    error: undefined,
    data: undefined,
  });

  useEffect(() => {
    run(func);
  }, []);

  const run = useCallback((func: () => Promise<ReturnType>, append = false) => {
    if (!status.isLoading) {
      setStatus({
        ...status,
        isLoading: true,
        isError: false,
        error: undefined,
      });
    }

    void func()
      .then((data) => {
        if (append) {
          setStatus({
            isLoading: false,
            isError: false,
            error: undefined,
            data: {
              ...status.data,
              ...data,
            },
          });
        } else {
          setStatus({
            isLoading: false,
            isError: false,
            error: undefined,
            data,
          });
        }
      })
      .catch((e) => {
        setStatus({
          isLoading: false,
          isError: true,
          error: e.message,
        });
      });
  }, []);

  const refresh = useCallback((refreshFunc?: () => Promise<ReturnType>) => {
    if (refreshFunc == null) refreshFunc = func;

    run(refreshFunc);
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
