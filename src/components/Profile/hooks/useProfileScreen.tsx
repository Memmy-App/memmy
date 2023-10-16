import { useRoute } from '@react-navigation/core';
import { useLoadData } from '@src/hooks';
import instance from '@src/Instance';
import { GetPersonDetailsResponse } from 'lemmy-js-client';
import React, { useEffect, useState } from 'react';
import { removeProfile } from '@src/state/profile/actions/removeProfile';
import { useCurrentAccount } from '@src/state/account/accountStore';
import { addProfile } from '@src/state/profile/actions';

interface UseProfileScreen {
  isLoading: boolean;
  isError: boolean;

  profileId: number;
}

export const useProfileScreen = (): UseProfileScreen => {
  const { key, params } = useRoute<any>();
  const { fullName, personId } = params;

  const currentAccount = useCurrentAccount();

  const [profileId, setProfileId] = useState<number>(-1);

  const { isLoading, isError } = useLoadData<
    GetPersonDetailsResponse | undefined
  >(async () => {
    const res = await instance.getPersonDetails(
      fullName ?? personId ?? currentAccount?.username,
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
