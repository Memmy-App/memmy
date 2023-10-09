import { IAccount } from "@types";
import { useAccountStore } from "@src/state/account/accountStore";

export const editAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const prev = state.accounts.find(
      (a) =>
        a.instance.toLowerCase() === account.instance.toLowerCase() &&
        a.username.toLowerCase() === account.instance.toLowerCase(),
    );

    if (!prev) return;

    prev.username = account.username;
    prev.instance = account.instance;
    prev.isCurrentAccount = account.isCurrentAccount;

    if (prev.isCurrentAccount) {
      state.currentAccount = prev;
    }
  });
};
