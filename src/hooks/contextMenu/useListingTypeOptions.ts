import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ContextMenuOptions } from "../../types/ContextMenuOptions";
import { ICON_MAP } from "../../constants/IconMap";

export const useListingTypeOptions = () => {
  const { t } = useTranslation();

  return useMemo<ContextMenuOptions>(
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
