import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ContextMenuOption } from "@src/types/ContextMenuOptions";
import { ICON_MAP } from "@src/constants/IconMap";

export const useTopSortOptions = () => {
  const { t } = useTranslation();

  return useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "TopHour",
        title: t("sort.top.Hour"),
        icon: ICON_MAP.CLOCK,
      },
      {
        key: "TopSixHour",
        title: t("sort.top.SixHours"),
        icon: ICON_MAP.CLOCK,
      },
      {
        key: "TopTwelveHour",
        title: t("sort.top.TwelveHours"),
        icon: ICON_MAP.CLOCK,
      },
      {
        key: "TopDay",
        title: t("sort.top.Day"),
        icon: ICON_MAP.CLOCK,
      },
      {
        key: "TopWeek",
        title: t("sort.top.Week"),
        icon: ICON_MAP.CALENDAR,
      },
      {
        key: "TopMonth",
        title: t("sort.top.Month"),
        icon: ICON_MAP.CALENDAR,
      },
      {
        key: "TopYear",
        title: t("sort.top.Year"),
        icon: ICON_MAP.CALENDAR,
      },
      {
        key: "TopAll",
        title: t("sort.top.AllTime"),
        icon: ICON_MAP.TROPHY,
      },
    ],
    [t]
  );
};
