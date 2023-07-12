import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { StyleSheet, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { HapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import { useAppActionSheet } from "../../../../hooks/app/useAppActionSheet";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showAppActionSheetWithOptions } = useAppActionSheet();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Haptics")}>
          <CCell
            cellStyle="RightDetail"
            title={t("Strength")}
            detail={t(`settings.haptics.${settings.haptics}`)}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [...HapticOptionsArr, t("Cancel")];
              const cancelButtonIndex = options.length - 1;

              showAppActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                },
                (index: number) => {
                  dispatch(setSetting({ haptics: options[index] }));
                }
              );
            }}
          />
        </CSection>
        <CSection header={t("Browser")}>
          <CCell
            title={t("Use Default Browser")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.useDefaultBrowser}
                onValueChange={(v) => onChange("useDefaultBrowser", v)}
              />
            }
          />
        </CSection>
      </TableView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default GeneralSettingsScreen;
