import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { showToast } from "../../slices/toast/toastSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

export const useReportPost = () => {
  const { t } = useTranslation();

  return useCallback(
    (postId: number, dispatch: any) =>
      Alert.prompt(t("post.report"), t("alert.message.reportPost"), [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Submit"),
          style: "default",
          onPress: async (v) => {
            try {
              await lemmyInstance.createPostReport({
                auth: lemmyAuthToken,
                post_id: postId,
                reason: v,
              });

              dispatch(
                showToast({
                  message: t("toast.reportSubmitSuccessful"),
                  duration: 3000,
                  variant: "info",
                })
              );
            } catch (e) {
              handleLemmyError(e.toString());
            }
          },
        },
      ]),
    [t]
  );
};
