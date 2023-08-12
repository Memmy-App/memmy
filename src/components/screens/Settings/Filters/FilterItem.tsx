import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import React, { useMemo } from "react";
import { useFiltersStore } from "@src/state/filters/filtersStore";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { Cell } from "@gkasdorf/react-native-tableview-simple";

interface IProps {
  name: string;
  type: "instances" | "keywords";
}

export function FilterItem({ name, type }: IProps): React.JSX.Element {
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
            case "keywords":
              return filtersStore.removeKeyword(name);
            case "instances":
              return filtersStore.removeInstance(name);
            default:
              throw new Error(`unknown filter store type ${type}`);
          }
        },
      },
    ]);
  };

  return (
    <Cell
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
