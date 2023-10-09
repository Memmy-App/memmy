import { IAccount } from "@types";
import { useAccountStore } from "@src/state/account/accountStore";

export const addAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const currentAccount = state.accounts.find((a) => a.isCurrentAccount);

    if (currentAccount) {
      currentAccount.isCurrentAccount = false;
    }

    account.isCurrentAccount = true;
    account.instance = account.instance.toLowerCase();

    state.accounts.push(account);
    state.currentAccount = account;
  });
};
