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

  addAccount: (account: Account) => void;
  editAccount: (account: Account) => void;
  deleteAccount: (account: Account) => void;

  setCurrentAccount: (account: Account) => void;
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
          state.status.loading = false;
          state.currentAccount = accounts.find((a) => a.isCurrent === true);
        });
      } catch (e) {
        set((state) => {
          state.status.loading = false;
        });
        writeToLog("Error loading accounts.");
        writeToLog(e.toString());
      }
    },

    addAccount: (account: Account) => {
      account.isCurrent = true;

      set((state) => {
        state.accounts.forEach((a) => {
          a.isCurrent = false;
        });

        state.accounts.push(account);
        state.currentAccount = account;

        AsyncStorage.setItem(
          "@accounts",
          JSON.stringify(state.accounts)
        ).then();
      });
    },

    editAccount: (account: Account) => {
      set((state) => {
        const index = state.accounts.findIndex(
          (a) =>
            a.username === account.username && a.instance === account.instance
        );

        state.accounts[index].password = account.password;
        state.accounts[index].token = account.token;

        AsyncStorage.setItem(
          "@accounts",
          JSON.stringify(state.accounts)
        ).then();
      });
    },

    deleteAccount: (account: Account) => {
      set((state) => {
        if (account.isCurrent) {
          state.accounts[0].isCurrent = true;
        }

        state.accounts = state.accounts.filter(
          (a) =>
            a.instance !== account.instance && a.username !== account.username
        );

        AsyncStorage.setItem(
          "@accounts",
          JSON.stringify(state.accounts)
        ).then();
      });
    },

    setCurrentAccount: (account: Account) => {
      set((state) => {
        const { accounts } = state;

        accounts.forEach((a) => {
          if (
            a.username === account.username &&
            a.instance === account.instance
          ) {
            a.isCurrent = true;

            state.currentAccount = a;
          } else {
            a.isCurrent = false;
          }
        });

        AsyncStorage.setItem("@accounts", JSON.stringify(accounts)).then();
      });
    },
  }))
);

export const useAccounts = () => useAccountStore((state) => state.accounts);

export const useCurrentAccount = () =>
  useAccountStore((state) => state.currentAccount);
