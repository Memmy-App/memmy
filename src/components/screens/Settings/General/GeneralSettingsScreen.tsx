import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { ScrollView } from "@src/components/gluestack";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { setSetting } from "@src/state/settings/actions";
import { hapticOptionsArr } from "@src/types/HapticOptions";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";

function GeneralSettingsScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const { t } = useTranslation();
  const theme = useThemeOptions();

  const onChange = (key: string, value: any) => {
    setSetting(key, value);
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

  const swipeLeftSecondOptions: any = useMemo(
    () => [
      ...swipeLeftSecondOptions.map((option: any) => ({
        key: option,
        title: t(`settings.swipeOptions.${option}`),
      })),
    ],
    [t]
  );

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <Section
          header={t("settings.appearance.gestures.header")}
          footer={t("settings.appearance.gestures.footer")}
        >
          <Cell
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
          <Cell
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
        </Section>
        <Section header={t("Swipes")}>
          <AppContextMenuButton
            options={swipeLeftSecondOptions}
            onPressMenuItem={({ nativeEvent }) => {
              setSetting("commentSwipeLeftSecond", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("settings.swipe.left.second")}
              detail={t(
                `settings.swipeOptions.${settings.commentSwipeLeftSecond}`
              )}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </AppContextMenuButton>
        </Section>
        <Section header={t("Haptics")}>
          <AppContextMenuButton
            options={hapticOptions}
            selection={settings.haptics}
            onPressMenuItem={({ nativeEvent }) => {
              setSetting("haptics", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("Strength")}
              detail={t(`settings.haptics.${settings.haptics}`)}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </AppContextMenuButton>
        </Section>
        <Section header={t("Browser")}>
          <Cell
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
            <Cell
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
        </Section>
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
