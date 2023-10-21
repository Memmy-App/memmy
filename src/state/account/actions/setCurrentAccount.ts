import { useAccountStore } from '@src/state';

export const setCurrentAccount = (fullName: string): void => {
  useAccountStore.setState((state) => {
    console.log(fullName);

    const currentAccount = state.accounts.find((c) => c.isCurrentAccount);

    if (currentAccount != null) {
      console.log('switchedAccount');
      currentAccount.isCurrentAccount = false;
    }
    const newCurrentAccount = state.accounts.find(
      (c) => c.fullUsername === fullName,
    );

    if (newCurrentAccount != null) {
      console.log('setAccount');
      newCurrentAccount.isCurrentAccount = true;
      state.currentAccount = newCurrentAccount;
    }
  });
};
