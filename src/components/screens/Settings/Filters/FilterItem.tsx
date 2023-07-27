import {
  FilterStoreType,
  useFiltersStore,
} from "@src/stores/filters/filtersStore";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import CCell from "@src/components/common/Table/CCell";
import React, { useMemo } from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface FilterItemProps {
  name: string;
  type: FilterStoreType;
}

export function FilterItem({ name, type }: FilterItemProps) {
  const filtersStore = useFiltersStore();
  const theme = useThemeOptions();
  const { t } = useTranslation();

  const alertTitle = useMemo(
    () => t(`settings.filters.remove.${type}`),
    [type, t]
  );

  const alertMessage = useMemo(
    () => t(`settings.filters.areYouSure.${type}`),
    [type, t]
  );

  const onOptionPress = () => {
    Alert.alert(alertTitle, alertMessage, [
      {
        text: t("Cancel"),
        style: "cancel",
      },
      {
        text: t("Remove"),
        style: "destructive",
        onPress: () => {
          switch (type) {
            case "keyword":
              return filtersStore.removeKeyword(name);
            case "instance":
              return filtersStore.removeInstance(name);
            default:
              throw new Error(`unknown filter store type ${type}`);
          }
        },
      },
    ]);
  };

  return (
    <CCell
      cellStyle="RightDetail"
      title={name}
      backgroundColor={theme.colors.fg}
      titleTextColor={theme.colors.textPrimary}
      rightDetailColor={theme.colors.textSecondary}
      accessory="DisclosureIndicator"
      onPress={onOptionPress}
    />
  );
}
