import React from "react";
import { VStack } from "@components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import { Switch } from "react-native";
import { useTranslation } from "react-i18next";
import CTable from "../../../common/Table/CTable";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";
import { setSetting } from "../../../../slices/settings/settingsActions";

function ReadSettingsScreen() {
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);

  const settings = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <VStack backgroundColor={theme.colors.bg}>
      <CTable>
        <CSection footer={t("settings.content.markRead.footer")}>
          <CCell
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
          <CCell
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
          <CCell
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
        </CSection>

        <CSection header={t("settings.content.markRead.header")}>
          <CCell
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
          <CCell
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
          <CCell
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
          <CCell
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
          <CCell
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
        </CSection>
      </CTable>
    </VStack>
  );
}

export default ReadSettingsScreen;
