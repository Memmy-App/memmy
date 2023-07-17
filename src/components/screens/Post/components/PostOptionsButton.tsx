import React from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch } from "../../../../../store";
import { lemmyAuthToken, lemmyInstance } from "../../../../LemmyInstance";
import { handleLemmyError } from "../../../../helpers/LemmyErrorHelper";
import { showToast } from "../../../../slices/toast/toastSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";

interface IProps {
  postId: number;
}

function CommentSortButton({ postId }: IProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const options = [t("Report Post")];

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
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        switch (nativeEvent.actionKey) {
          case "Report Post":
            onReportPress().then();
            break;
          default:
            break;
        }
      }}
      menuConfig={{
        menuTitle: "",
        // @ts-ignore Types for menuItems are wrong for this library
        menuItems: [
          ...options.map((option) => ({
            actionKey: option,
            actionTitle: option,
            icon: {
              type: "IMAGE_SYSTEM",
              imageValue: {
                systemName: optionIcons[option],
              },
            },
          })),
        ],
      }}
    >
      <HeaderIconButton icon={<SFIcon icon="ellipsis" />} />
    </ContextMenuButton>
  );
}

const optionIcons: Record<string, string> = {
  "Report Post": "flag",
};

export default CommentSortButton;
