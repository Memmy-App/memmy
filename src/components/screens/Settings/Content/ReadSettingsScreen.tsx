import React from "react";
import { VStack } from "@src/components/gluestack";
import { Switch } from "react-native";
import { useTranslation } from "react-i18next";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { setSetting } from "@src/state/settings/actions";

function ReadSettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useThemeOptions();

  const settings = useSettingsStore();

  const onChange = (key: string, value: any) => {
    setSetting(key, value);
  };

  return (
    <VStack backgroundColor={theme.colors.bg}>
      <TableView>
        <Section footer={t("settings.content.markRead.footer")}>
          <Cell
            cellStyle="RightDetail"
            title={t("Hide Read Posts on Feed")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideReadPostsOnFeed}
                onValueChange={(v) => {
                  onChange("hideReadPostsOnFeed", v);
                }}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={`${t("Hide Read Posts in Communities")}`}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideReadPostsInCommunities}
                onValueChange={(v) => onChange("hideReadPostsInCommunities", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("Show Hide Read Button")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showHideReadButton}
                onValueChange={(v) => {
                  onChange("showHideReadButton", v);
                }}
              />
            }
          />
        </Section>

        <Section header={t("settings.content.markRead.header")}>
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.markRead.onPostOpen")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostView}
                onValueChange={(v) => onChange("markReadOnPostView", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.markRead.onImageView")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostImageView}
                onValueChange={(v) => onChange("markReadOnPostImageView", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={`${t("settings.content.markRead.onVote")} ↑↓`}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostVote}
                onValueChange={(v) => onChange("markReadOnPostVote", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.markRead.onFeedScroll")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnFeedScroll}
                onValueChange={(v) => {
                  onChange("markReadOnFeedScroll", v);
                }}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.markRead.onCommunityScroll")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnCommunityScroll}
                onValueChange={(v) => {
                  onChange("markReadOnCommunityScroll", v);
                }}
              />
            }
          />
        </Section>
      </TableView>
    </VStack>
  );
}

export default ReadSettingsScreen;
