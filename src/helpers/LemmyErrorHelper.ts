import { Alert } from "react-native";
import {
  alertableErrors,
  lemmyErrors,
  LemmyErrorType,
} from "../types/lemmy/LemmyErrors";

export const handleLemmyError = (error: LemmyErrorType | string) => {
  if (alertableErrors.includes(error as LemmyErrorType)) {
    Alert.alert("Error", lemmyErrors[error]);
  }
};
