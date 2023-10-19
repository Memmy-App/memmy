import { useAccountStore } from '@src/state';
import { IAccount } from '@src/types';

export const deleteAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    state.accounts = state.accounts.filter(
      (a) =>
        a.instance.toLowerCase() !== account.instance.toLowerCase() &&
        a.username.toLowerCase() !== account.username.toLowerCase(),
    );
  });
};
