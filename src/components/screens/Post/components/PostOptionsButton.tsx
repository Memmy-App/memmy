import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu/src/types/MenuEvents";
import { useAppDispatch } from "../../../../../store";
import { useReportPost } from "../../../../hooks/post/useReportPost";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";
import { useCurrentPostState } from "../../../../stores/posts/postsStore";
import { ContextMenuOption } from "../../../../types/ContextMenuOptions";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

function CommentSortButton() {
  const route = useRoute<any>();
  const { postKey } = route.params;
  const post = useCurrentPostState(postKey);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const reportPost = useReportPost();

  const options = useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "ReportPost",
        title: t("Report Post"),
        icon: ICON_MAP.REPORT_POST,
        destructive: true,
      },
    ],
    [t]
  );

  const onPressMenuItem = ({ nativeEvent }: OnPressMenuItemEventObject) => {
    switch (nativeEvent.actionKey) {
      case "ReportPost":
        reportPost(post.post.post.id, dispatch);
        break;
      default:
        break;
    }
  };

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onPressMenuItem}>
      <HeaderIconButton icon={<SFIcon icon={ICON_MAP.MORE_OPTIONS} />} />
    </AppContextMenuButton>
  );
}

export default CommentSortButton;
