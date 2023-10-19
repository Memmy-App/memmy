import { useRoute } from '@react-navigation/core';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { GetPersonDetailsResponse } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { addProfile, removeProfile, useCurrentAccount } from '@src/state';

interface UseProfileScreen {
  isLoading: boolean;
  isError: boolean;

  profileId: number;
}

export const useProfileScreen = (): UseProfileScreen => {
  const { key, params } = useRoute<any>();

  const currentAccount = useCurrentAccount();

  const [profileId, setProfileId] = useState<number>(-1);

  const { isLoading, isError } = useLoadData<
    GetPersonDetailsResponse | undefined
  >(async () => {
    const res = await instance.getPersonDetails(
      params?.fullName ?? params?.personId ?? currentAccount?.username,
    );

    setProfileId(res?.person_view.person.id ?? -1);
    addProfile(res, key);

    return res;
  });

  // Remove the profile whenever we leave the screen
  useEffect(() => {
    return () => {
      removeProfile(profileId);
    };
  }, []);

  return {
    isLoading,
    isError,

    profileId,
  };
};
