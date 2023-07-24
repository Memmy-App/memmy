import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ContextMenuOption } from "../../types/ContextMenuOptions";
import { ICON_MAP } from "../../constants/IconMap";

export const useCommentSortOptions = () => {
  const { t } = useTranslation();

  return useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "Top",
        title: t("sort.Top"),
        icon: ICON_MAP.TROPHY,
      },
      {
        key: "Hot",
        title: t("sort.Hot"),
        icon: ICON_MAP.FLAME,
      },
      {
        key: "New",
        title: t("sort.New"),
        icon: ICON_MAP.ALARM,
      },
      {
        key: "Old",
        title: t("sort.Old"),
        icon: ICON_MAP.HOURGLASS,
      },
    ],
    [t]
  );
};
