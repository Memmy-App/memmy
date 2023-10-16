import { useRoute } from '@react-navigation/core';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { useState } from 'react';
import { GetPersonDetailsResponse } from 'lemmy-js-client';

interface UseProfileScreen {
  isLoading: boolean;
  isError: boolean;

  personDetails?: GetPersonDetailsResponse;
}

export const useProfileScreen = (): UseProfileScreen => {
  const { fullName, personId } = useRoute<any>();

  const [page, setPage] = useState(1);

  const { isLoading, isError, data } = useLoadData(
    async () => {
      return await instance.getPersonDetails(fullName ?? personId, page);
    },
    undefined,
    setPage,
  );

  return {
    isLoading,
    isError,

    personDetails: data,
  };
};
