import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView } from "@components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { hapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemeOptions);

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection
          header={t("settings.appearance.gestures.header")}
          footer="Disabling swipe to vote will allow for full-screen swipe gestures."
        >
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.gestures.tapToCollapse")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.tapToCollapse}
                onValueChange={(v) => onChange("tapToCollapse", v)}
              />
            }
          />
          <CCell
            cellStyle="Basic"
            title={t("settings.swipeToVote")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.swipeToVote}
                onValueChange={(v) => onChange("swipeToVote", v)}
              />
            }
          />
        </CSection>
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
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </ContextMenuButton>
        </CSection>
        <CSection header={t("Browser")}>
          <CCell
            title={t("Use Default Browser")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
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
