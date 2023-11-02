import { IAccount } from '@src/types';
import { useAccountStore } from '@src/state';

export const setAccountNotifications = (
  a: IAccount,
  isEnabled: boolean,
): void => {
  useAccountStore.setState((state) => {
    const account = state.accounts.find(
      (aa) => aa.instance === a.instance && aa.username === a.username,
    );

    if (account == null) return;

    account.notificationsEnabled = isEnabled;
  });
};
