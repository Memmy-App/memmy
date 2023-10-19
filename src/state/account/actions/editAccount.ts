import { useAccountStore } from '@src/state';
import { IAccount } from '@src/types';

export const editAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const prev = state.accounts.find(
      (a) =>
        a.instance.toLowerCase() === account.instance.toLowerCase() &&
        a.username.toLowerCase() === account.instance.toLowerCase(),
    );

    if (prev == null) return;

    prev.username = account.username;
    prev.instance = account.instance;
    prev.isCurrentAccount = account.isCurrentAccount;

    if (prev.isCurrentAccount) {
      state.currentAccount = prev;
    }
  });
};
