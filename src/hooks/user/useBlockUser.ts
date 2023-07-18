import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import { showToast } from "../../slices/toast/toastSlice";

export const useBlockUser = async ({
  personId,
  dispatch,
  t,
}: {
  personId: number;
  dispatch: any;
  t: any;
}) => {
  try {
    await lemmyInstance.blockPerson({
      auth: lemmyAuthToken,
      person_id: personId,
      block: true,
    });

    dispatch(
      showToast({
        message: t("toast.userBlockedSuccess"),
        duration: 3000,
        variant: "info",
      })
    );
  } catch (e) {
    handleLemmyError(e.toString());
  }
};
