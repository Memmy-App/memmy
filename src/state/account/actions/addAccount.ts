import IAccount from "@src/types/IAccount";
import { useAccountStore } from "@src/state/account/accountStore";

export const addAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    account.isCurrentAccount = true;
    state.accounts.push(account);
    state.currentAccount = account;
  });
};
