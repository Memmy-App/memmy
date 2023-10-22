import { useAccountStore } from '@src/state';

export const setCurrentAccount = (fullName: string): void => {
  useAccountStore.setState((state) => {
    const currentAccount = state.accounts.find((c) => c.isCurrentAccount);

    if (currentAccount != null) {
      currentAccount.isCurrentAccount = false;
    }
    const newCurrentAccount = state.accounts.find(
      (c) => c.fullUsername === fullName,
    );

    if (newCurrentAccount != null) {
      newCurrentAccount.isCurrentAccount = true;
      state.currentAccount = newCurrentAccount;
    }
  });
};
