import React from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch } from "../../../../../store";
import { useReportPost } from "../../../../hooks/post/useReportPost";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";

interface IProps {
  postId: number;
}

function CommentSortButton({ postId }: IProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const options = [t("Report Post")];

  return (
    <ContextMenuButton
      isMenuPrimaryAction
      onPressMenuItem={({ nativeEvent }) => {
        switch (nativeEvent.actionKey) {
          case "Report Post":
            useReportPost({ postId, dispatch }).then();
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
  "Report Post": ICON_MAP.REPORT_POST,
};

export default CommentSortButton;
