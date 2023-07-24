import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView, useTheme } from "native-base";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { hapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import { AppContextMenuButton } from "../../../common/ContextMenu/App/AppContextMenuButton";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection
          header={t("settings.appearance.gestures.header")}
          footer="Disabling swipe to vote will allow for full-screen swipe gestures."
        >
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.gestures.tapToCollapse")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
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
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
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
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              accessory="DisclosureIndicator"
            />
          </AppContextMenuButton>
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
