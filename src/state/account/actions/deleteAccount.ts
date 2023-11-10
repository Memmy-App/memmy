import { useAccountStore } from '@src/state';
import { IAccount } from '@src/types';
import { removeAccessToken } from '@helpers/secureStore';

export const deleteAccount = (account: IAccount): void => {
  // Remove token from secure store
  void removeAccessToken(account);
  useAccountStore.setState((state) => {
    state.accounts = state.accounts.filter(
      (a) =>
        `${a.instance.toLowerCase()}${a.username.toLowerCase()}` !==
        `${account.instance.toLowerCase()}${account.username.toLowerCase()}`,
    );
  });
};
