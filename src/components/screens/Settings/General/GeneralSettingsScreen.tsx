import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { hapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Haptics")}>
          <ContextMenuButton
            isMenuPrimaryAction
            onPressMenuItem={({ nativeEvent }) => {
              dispatch(setSetting({ haptics: nativeEvent.actionKey }));
            }}
            menuConfig={{
              menuTitle: "",
              // @ts-ignore Types for menuItems are wrong for this library
              menuItems: [
                ...hapticOptionsArr.map((option) => ({
                  actionKey: option,
                  actionTitle: option,
                  menuState: settings.haptics === option ? "on" : "off",
                })),
              ],
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Strength")}
              detail={t(`settings.haptics.${settings.haptics}`)}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              accessory="DisclosureIndicator"
            />
          </ContextMenuButton>
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
