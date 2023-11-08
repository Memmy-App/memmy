import { useCurrentAccount, useIsSitePrivate } from '@src/state';
import { useMemo } from 'react';
import { getBaseUrl } from '@helpers/links';
import instance from '@src/Instance';

export const useCreateImageHeaders = (
  source: string,
): Record<string, string> => {
  const isSitePrivate = useIsSitePrivate();
  const currentAccount = useCurrentAccount();

  // @ts-expect-error TODO Fix later
  return useMemo(() => {
    if (!isSitePrivate) return {};

    if (getBaseUrl(source) === currentAccount?.instance) {
      return {
        Cookie: `jwt=${instance.authToken}`,
      };
    }

    return {};
  }, [source, isSitePrivate]);
};
