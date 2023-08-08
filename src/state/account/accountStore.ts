import IAccount from "@src/types/IAccount";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AccountStore {
  accounts: IAccount[];
  currentAccount: IAccount | null;

  status: {
    loading: boolean;
    error: boolean;
    notFound: boolean;
  };
}

export const useAccountStore = create(
  persist(
    immer<AccountStore>(() => ({
      accounts: [],
      currentAccount: null,

      status: {
        loading: false,
        error: false,
        notFound: false,
      },
    })),
    {
      name: "account",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCurrentAccount = (): IAccount | null =>
  useAccountStore((state) => state.currentAccount);
