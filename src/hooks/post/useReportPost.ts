import { Alert } from "react-native";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { showToast } from "../../slices/toast/toastSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

export const useReportPost = async ({
  postId,
  dispatch,
}: {
  postId: number;
  dispatch: any;
}) => {
  await Alert.prompt(
    "Report Post",
    "Please describe your reason for reporting this Post.",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Submit",
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
                message: "Report submitted successfully",
                duration: 3000,
                variant: "info",
              })
            );
          } catch (e) {
            handleLemmyError(e.toString());
          }
        },
      },
    ]
  );
};
