import { useAccountStore } from '@src/state';
import { IAccount } from '@src/types';

export const removeAccessTokenFromDataStore = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    const storedAccount = state.accounts.find(
      (a) => a.instance === account.instance && a.username === account.username,
    );

    if (storedAccount == null) return;

    storedAccount.token = '';
  });
};
