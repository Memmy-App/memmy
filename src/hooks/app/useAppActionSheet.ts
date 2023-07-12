import { useActionSheet } from "@expo/react-native-action-sheet";
import { ActionSheetProps } from "@expo/react-native-action-sheet/lib/typescript/types";
import { useTheme } from "native-base";
import { onGenericHapticFeedback } from "../../helpers/HapticFeedbackHelpers";

export const useAppActionSheet = () => {
  const theme = useTheme();

  const { showActionSheetWithOptions } = useActionSheet();

  const showAppActionSheetWithOptions: ActionSheetProps["showActionSheetWithOptions"] =
    (options, callback) => {
      const defaultOptions = {
        userInterfaceStyle: theme.config.initialColorMode,
      };

      showActionSheetWithOptions({ ...defaultOptions, ...options }, (index) => {
        onGenericHapticFeedback();
        if (index === options.cancelButtonIndex) return;
        callback(index);
      });
    };

  return {
    showAppActionSheetWithOptions,
  };
};
