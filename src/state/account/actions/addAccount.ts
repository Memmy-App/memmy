import { useAccountStore } from '@src/state/account/accountStore';
import { IAccount } from '@src/types';

export const addAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const currentAccount = state.accounts.find((a) => a.isCurrentAccount);

    if (currentAccount != null) {
      currentAccount.isCurrentAccount = false;
    }

    account.isCurrentAccount = true;
    account.instance = account.instance.toLowerCase();

    state.accounts.push(account);
    state.currentAccount = account;
  });
};
