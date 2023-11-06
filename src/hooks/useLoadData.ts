import React, { useEffect, useRef, useState } from 'react';
import { writeToLog } from '@src/helpers';

interface UseLoadData<DataType = undefined> {
  refresh: (refreshFunc?: () => Promise<DataType>) => void;
  append: (appendFunc: () => Promise<DataType>) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error?: string;
  data?: DataType;
}

interface Status {
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error?: string;
}

export const useLoadData = <ReturnType>(
  func?: () => Promise<ReturnType>,
  cacheFunc?: () => boolean,
  setPage?: React.Dispatch<React.SetStateAction<number>>,
): UseLoadData<ReturnType> => {
  const inProgress = useRef(false);

  const [status, setStatus] = useState<Status>({
    isLoading: func != null,
    isRefreshing: false,
    isError: false,
    error: undefined,
  });

  const [returnData, setReturnData] = useState<ReturnType>();

  useEffect(() => {
    if (func == null) return;

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

  const run = (
    func: () => Promise<ReturnType>,
    append = false,
    refresh = false,
  ): void => {
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
          if (returnData != null && data != null) {
            // @ts-expect-error We already checked that data is iterable
            setReturnData((prev) => [...(prev ?? []), ...data]);
          }

          setPage?.((prev) => prev + 1);
        } else {
          setReturnData(data);

          setPage?.(2);
        }

        setStatus((prev) => ({
          ...prev,
          isLoading: false,
          isError: false,
          isRefreshing: false,
          error: undefined,
        }));

        inProgress.current = false;
      })
      .catch((e) => {
        writeToLog('Request Error');
        writeToLog(e);

        setStatus((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
          isRefreshing: false,
          error: e.message,
        }));

        inProgress.current = false;
      });
  };

  const refresh = (refreshFunc?: () => Promise<ReturnType>): void => {
    if (refreshFunc == null && func != null) refreshFunc = func;

    if (refreshFunc == null) return;

    run(refreshFunc, false, true);
  };

  const append = (appendFunc: () => Promise<ReturnType>): void => {
    run(appendFunc, true);
  };

  return {
    ...status,
    refresh,
    append,
    data: returnData,
  };
};
