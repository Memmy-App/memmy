import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ContextMenuOption } from "../../types/ContextMenuOptions";
import { ICON_MAP } from "../../constants/IconMap";

export const useFeedCommunityOptions = () => {
  const { t } = useTranslation();

  return useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "Subscribe",
        title: t("Subscribe"),
        icon: ICON_MAP.SUBSCRIBE,
      },
      {
        key: "BlockCommunity",
        title: t("Block"),
        icon: ICON_MAP.BLOCK,
        destructive: true,
      },
    ],
    [t]
  );
};
