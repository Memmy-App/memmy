import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView } from "@src/components/common/Gluestack";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import {
  useSettings,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import setSetting from "@src/stores/settings/actions/setSetting";
import { hapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

function GeneralSettingsScreen() {
  const settings = useSettings();

  const { t } = useTranslation();
  const theme = useThemeOptions();

  const onChange = (key: string, value: any) => {
    setSetting({ [key]: value });
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
              setSetting({ haptics: nativeEvent.actionKey }).then();
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
          {!settings.useDefaultBrowser && (
            <CCell
              title={t("settings.general.useReaderMode")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              cellAccessoryView={
                <Switch
                  value={settings.useReaderMode}
                  onValueChange={(v) => onChange("useReaderMode", v)}
                />
              }
            />
          )}
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
