import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { IAccount } from '@src/types';

interface AccountStore {
  accounts: IAccount[];
  currentAccount: IAccount | null;

  reset: () => void;
}

const initialState: Partial<AccountStore> = {
  accounts: [],
  currentAccount: null,
};

export const useAccountStore = create(
  persist(
    immer<AccountStore>((set) => ({
      accounts: [],
      currentAccount: null,

      reset: () => {
        set((state) => ({
          ...state,
          ...initialState,
        }));
      },
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
