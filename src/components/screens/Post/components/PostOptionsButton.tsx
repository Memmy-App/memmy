import React from "react";
import { useTheme } from "native-base";
import { IconDots } from "tabler-icons-react-native";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { showToast } from "../../../../slices/toast/toastSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { useAppActionSheet } from "../../../../hooks/app/useAppActionSheet";
import { handleLemmyError } from "../../../../helpers/LemmyErrorHelper";

interface IProps {
  postId: number;
}

function CommentSortButton({ postId }: IProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { showAppActionSheetWithOptions } = useAppActionSheet();
  const dispatch = useAppDispatch();

  const onPress = () => {
    const options = [t("Report Post"), t("Cancel")];
    const cancelButtonIndex = options.length - 1;

    showAppActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (index) => {
        if (index === 0) onReportPress().then();
      }
    );
  };

  const onReportPress = async () => {
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

  return (
    <HeaderIconButton
      icon={<IconDots size={24} color={theme.colors.app.accent} />}
      onPress={onPress}
    />
  );
}

export default CommentSortButton;
