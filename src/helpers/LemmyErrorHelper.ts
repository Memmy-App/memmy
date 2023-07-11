import { Alert } from "react-native";
import {
  alertableErrors,
  lemmyErrors,
  LemmyErrorType,
} from "../types/lemmy/LemmyErrors";
import store from "../../store";
import { showToast } from "../slices/toast/toastSlice";

export const handleLemmyError = (code: LemmyErrorType | string) => {
  // Find the error if it exists
  const error = lemmyErrors.find((e) => e.code === code);

  // If it doesn't exist, we should let the user know and display the error code
  if (!error) {
    Alert.alert(
      "Unknown Error",
      `An unknown error has occurred. Code: ${code}`
    );
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
