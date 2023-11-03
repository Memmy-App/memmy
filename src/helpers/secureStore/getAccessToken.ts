import { IAccount } from '@src/types';
import * as SecureStore from 'expo-secure-store';

export const getAccessToken = async (
  account: IAccount,
): Promise<string | null> => {
  return await SecureStore.getItemAsync(
    `${account.instance.toLowerCase()}${account.username.toLowerCase()}`,
    {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    },
  );
};
