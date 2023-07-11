import { Alert } from "react-native";
import {
  alertableErrors,
  lemmyErrors,
  LemmyErrorType,
} from "../types/lemmy/LemmyErrors";
import store from "../../store";
import { showToast } from "../slices/toast/toastSlice";
import {
  deleteAccount,
  setCurrentAccount,
} from "../slices/accounts/accountsActions";
import { writeToLog } from "./LogHelper";

export const handleLemmyError = (code: LemmyErrorType | string) => {
  // Log the error to debug
  writeToLog("Lemmy Error:");
  writeToLog(code);

  // Find the error if it exists
  const error = lemmyErrors.find((e) => e.code === code);

  // If it doesn't exist, we should let the user know and display the error code
  if (!error) {
    // There are some errors that still are not sent in JSON or don't have any response body at all. This ends up giving
    // us a JSON syntax error. There's a PR that was merged recently to fix some of these things, so it should be ok
    // here soon. For now we will just see if the error includes "Syntax Error" and show a toast.

    if (code.includes("SyntaxError")) {
      store.dispatch(
        showToast({
          message: "An unknown error has occurred.",
          variant: "error",
          duration: 3000,
        })
      );
    } else {
      Alert.alert(
        "Unknown Error",
        `An unknown error has occurred. Code: ${code}`
      );
    }
    return;
  }

  // If the error is not_logged_in, then we know the token has expired. We remove the account from redux and either
  // switch the user to another account or (if no other account exists) the conditional inside of Stack will direct
  // them to log in
  if (error.code === "not_logged_in") {
    Alert.alert(
      "Error",
      "Your session has expired. Please sign back in to this account."
    );

    // Get the current account
    const { currentAccount, accounts } = store.getState().accounts;

    // We should change the user to a different account *before* removing the account, if possible
    const accountIndex = accounts.findIndex(
      (a) =>
        a.username === currentAccount.username &&
        a.instance === currentAccount.instance
    );

    // If there are additional accounts we will switch to that one.
    if (accounts.length > 1) {
      if (accountIndex === 0) {
        store.dispatch(setCurrentAccount(accounts[1]));
      } else {
        store.dispatch(setCurrentAccount(accounts[0]));
      }
    }

    // Delete the account
    store.dispatch(deleteAccount(currentAccount));

    return;
  }

  // If this error is of the alertable type, we will display an alert dialog
  if (alertableErrors.includes(error.code)) {
    Alert.alert("Error", error.message);
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
