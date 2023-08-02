import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuOption } from "../../types/ContextMenuOptions";
import { ICON_MAP } from "../../constants/IconMap";
// import { useFeedCommunityOptions } from "./useFeedCommunityOptions";

export const useFeedOptions = () => {
  const { t } = useTranslation();

  // const communityOptions = useFeedCommunityOptions();

  return useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "Upvote",
        title: t("Upvote"),
        icon: ICON_MAP.UPVOTE,
      },
      {
        key: "Downvote",
        title: t("Downvote"),
        icon: ICON_MAP.DOWNVOTE,
      },
      {
        key: "Reply",
        title: t("Reply"),
        icon: ICON_MAP.REPLY,
      },
      {
        key: "Save",
        title: t("Save"),
        icon: ICON_MAP.SAVE,
      },
      {
        key: "Share",
        title: t("post.share"),
        icon: ICON_MAP.SHARE,
      },
      {
        key: "Report",
        title: t("post.report"),
        icon: ICON_MAP.REPORT_POST,
      },
      {
        key: "BlockUser",
        title: t("Block User"),
        icon: ICON_MAP.BLOCK_USER,
        destructive: true,
      },
      // TODO Issue #747 - Add community actions
      // {
      //   key: "CommunityMenu",
      //   title: t("Community"),
      //   options: [...communityOptions],
      // },
    ],
    [t]
  );
};
