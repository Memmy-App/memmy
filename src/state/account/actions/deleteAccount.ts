import IAccount from "@src/types/IAccount";
import { useAccountStore } from "@src/state/account/accountStore";

export const deleteAccount = (account: IAccount): void => {
  useAccountStore.setState((state) => {
    state.accounts = state.accounts.filter(
      (a) =>
        a.host.toLowerCase() !== account.host.toLowerCase() &&
        a.username.toLowerCase() !== account.username.toLocaleLowerCase()
    );
  });
};
