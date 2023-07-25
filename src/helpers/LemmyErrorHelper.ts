import { Alert } from "react-native";
import store from "../../store";
import i18n from "../plugins/i18n/i18n";
import { showToast } from "../slices/toast/toastSlice";
import {
  useAccounts,
  useAccountStore,
  useCurrentAccount,
} from "../stores/account/accountStore";
import {
  alertableErrors,
  lemmyErrors,
  LemmyErrorType,
} from "../types/lemmy/LemmyErrors";
import { writeToLog } from "./LogHelper";

export const handleLemmyError = (code: LemmyErrorType | string) => {
  const accountStore = useAccountStore();

  // Log the error to debug
  writeToLog("Lemmy Error:");
  writeToLog(code);

  // Find the error if it exists
  const error = lemmyErrors.find((e) => e.code === code);

  // If it doesn't exist, we should let the user know and display the error code
  if (!error) {
    // There are some errors that still are not sent in JSON or don't have any response body at all. This ends up giving
    // us a JSON syntax error. There's a PR that was merged recently to fix some of these things, so it should be ok
    // here soon. For now, we will just see if the error includes "Syntax Error" and show a toast.

    if (code.includes("SyntaxError")) {
      store.dispatch(
        showToast({
          message: i18n.t("toast.unknownError"),
          variant: "error",
          duration: 3000,
        })
      );
    } else {
      Alert.alert(
        i18n.t("alert.title.unknownError"),
        i18n.t("alert.message.unknownError", [code])
      );
    }
    return;
  }

  // If the error is not_logged_in, then we know the token has expired. We remove the account from redux and either
  // switch the user to another account or (if no other account exists) the conditional inside of Stack will direct
  // them to log in
  if (error.code === "not_logged_in") {
    // Get the current account
    const accounts = useAccounts();
    const currentAccount = useCurrentAccount();

    Alert.alert(
      i18n.t("alert.title.error"),
      i18n.t("alert.message.sessionExpired", [
        `${currentAccount.username}@${currentAccount.instance}`,
      ])
    );

    // We should change the user to a different account *before* removing the account, if possible
    const accountIndex = accounts.findIndex(
      (a) =>
        a.username === currentAccount.username &&
        a.instance === currentAccount.instance
    );

    // If there are additional accounts we will switch to that one.
    if (accounts.length > 1) {
      if (accountIndex === 0) {
        accountStore.setCurrentAccount(accounts[1]).then();
      } else {
        accountStore.setCurrentAccount(accounts[0]).then();
      }
    }

    // Delete the account
    accountStore.deleteAcount(currentAccount).then();
    return;
  }

  // If this error is of the alertable type, we will display an alert dialog
  if (alertableErrors.includes(error.code)) {
    Alert.alert(i18n.t("alert.title.error"), error.message);
  }

  // Create a toast
  store.dispatch(
    showToast({
      message: error.message,
      variant: "error",
      duration: 3000,
    })
  );
};
