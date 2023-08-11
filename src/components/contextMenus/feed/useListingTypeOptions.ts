import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ContextMenuOption } from "@src/types/ContextMenuOptions";
import { ICON_MAP } from "@src/types/constants/IconMap";

export const useListingTypeOptions = (): ContextMenuOption[] => {
  const { t } = useTranslation();

  return useMemo<ContextMenuOption[]>(
    () => [
      {
        key: "All",
        title: t("All"),
        icon: ICON_MAP.GLOBE,
      },
      {
        key: "Local",
        title: t("Local"),
        icon: ICON_MAP.LOCATION,
      },
      {
        key: "Subscribed",
        title: t("Subscribed"),
        icon: ICON_MAP.HEART,
      },
    ],
    [t]
  );
};
