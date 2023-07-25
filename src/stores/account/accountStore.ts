import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../../types/Account";
import { writeToLog } from "../../helpers/LogHelper";

interface AccountStore {
  accounts: Account[];
  currentAccount: Account | null;

  status: {
    loading: boolean;
    error: boolean;
    notFound: boolean;
  };

  init: () => Promise<void>;

  addAccount: (account: Account) => Promise<void>;
  editAccount: (account: Account) => Promise<void>;
  deleteAcount: (account: Account) => Promise<void>;

  setCurrentAccount: (account: Account) => Promise<void>;
}

export const useAccountStore = create(
  immer<AccountStore>((set) => ({
    accounts: [],
    currentAccount: null,

    status: {
      loading: true,
      error: false,
      notFound: false,
    },

    init: async () => {
      try {
        const accounts =
          (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ??
          [];
        set((state) => {
          state.accounts = accounts;
        });
      } catch (e) {
        writeToLog("Error loading accounts.");
        writeToLog(e.toString());
      }
    },

    addAccount: async (account: Account) => {
      const accounts =
        (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ??
        [];
      accounts.forEach((a) => {
        a.isCurrent = false;
      });
      account.isCurrent = true;
      accounts.push(account);
      await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    },

    editAccount: async (account: Account) => {
      const accounts =
        (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ??
        [];

      const index = accounts.findIndex(
        (a) =>
          a.username === account.username && a.instance === account.instance
      );

      accounts[index].password = account.password;
      accounts[index].token = account.token;

      await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    },

    deleteAcount: async (account: Account) => {
      const accounts =
        (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ??
        [];

      const updatedAccounts = accounts.filter(
        (a) =>
          a.username !== account.username || a.instance !== account.instance
      );

      await AsyncStorage.setItem("@accounts", JSON.stringify(updatedAccounts));
    },

    setCurrentAccount: async (account: Account) => {
      const accounts =
        (JSON.parse(await AsyncStorage.getItem("@accounts")) as Account[]) ??
        [];

      accounts.forEach((a) => {
        if (a.username === account.username && a.instance === account.instance)
          a.isCurrent = true;
        else delete a.isCurrent;
      });

      await AsyncStorage.setItem("@accounts", JSON.stringify(accounts));
    },
  }))
);

export const useAccounts = () => useAccountStore((state) => state.accounts);

export const useCurrentAccount = () =>
  useAccountStore((state) => state.currentAccount);
