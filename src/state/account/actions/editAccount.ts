import IAccount from "@src/types/IAccount";
import { useAccountStore } from "@src/state/account/accountStore";

export const editAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const prev = state.accounts.find(
      (a) =>
        a.host.toLowerCase() === account.host.toLowerCase() &&
        a.username.toLowerCase() === account.username.toLowerCase()
    );

    if (!prev) return;

    prev.username = account.username;
    prev.host = account.host;
    prev.isCurrentAccount = true;

    state.currentAccount = account;
  });
};
