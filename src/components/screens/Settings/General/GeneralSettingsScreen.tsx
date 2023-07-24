import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView } from "@components/common/Gluestack";
import React, { useMemo } from "react";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { hapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemeOptions);

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  const hapticOptions = useMemo(
    () => [
      ...hapticOptionsArr.map((level) => ({
        key: level,
        title: t(`settings.haptics.${level}`),
      })),
    ],
    [t]
  );

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
          <AppContextMenuButton
            options={hapticOptions}
            selection={settings.haptics}
            onPressMenuItem={({ nativeEvent }) => {
              dispatch(setSetting({ haptics: nativeEvent.actionKey }));
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
          </AppContextMenuButton>
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
