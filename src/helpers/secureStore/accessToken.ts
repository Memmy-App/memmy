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

export const removeAccessToken = async (account: IAccount): Promise<void> => {
  return await SecureStore.deleteItemAsync(
    `${account.instance.toLowerCase()}${account.username.toLowerCase()}`,
  );
};
