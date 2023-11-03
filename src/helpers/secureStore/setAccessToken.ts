import { IAccount } from '@src/types';
import * as SecureStore from 'expo-secure-store';

export const setAccessToken = async (
  account: IAccount,
  token: string,
): Promise<void> => {
  await SecureStore.setItemAsync(
    `${account.instance.toLowerCase()}${account.username.toLowerCase()}`,
    token,
    {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    },
  );
};
