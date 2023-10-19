import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { IAccount } from '@src/types';

interface AccountStore {
  accounts: IAccount[];
  currentAccount: IAccount | null;
}

export const useAccountStore = create(
  persist(
    immer<AccountStore>(() => ({
      accounts: [],
      currentAccount: null,
    })),
    {
      name: 'account',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useAccounts = (): IAccount[] =>
  useAccountStore((state) => state.accounts);

export const useCurrentAccount = (): IAccount | null =>
  useAccountStore((state) => state.currentAccount);
