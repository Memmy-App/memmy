import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "@src/components/gluestack";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch } from "react-native";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { useOverallSortOptions } from "@src/components/contextMenus/useOverallSortOptions";
import { setSetting } from "@src/state/settings/actions";
import { FeedSortContextMenu } from "@src/components/contextMenus/feed/FeedSortContextMenu";
import { ListingTypeContextMenu } from "@src/components/contextMenus/feed/ListingTypeContextMenu";
import { CommentSortContextMenu } from "@src/components/contextMenus/comments/CommentSortContextMenu";
import { findOptionByKey } from "@src/helpers/general";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function ContentScreen({ navigation }: IProps): React.JSX.Element {
  const settings = useSettingsStore();

  const { t } = useTranslation();
  const theme = useThemeOptions();
  const overallSortOptions = useOverallSortOptions();

  const onChange = (key: string, value: any) => {
    setSetting(key, value);
  };

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <Section header={t("Posts")}>
          <FeedSortContextMenu
            currentSelection={settings.defaultSort}
            onPress={({ nativeEvent }) => {
              onChange("defaultSort", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("Default Sort")}
              detail={
                findOptionByKey(overallSortOptions, settings.defaultSort)!.title
              }
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </FeedSortContextMenu>
          <CommentSortContextMenu
            currentSelection={settings.defaultCommentSort}
            onPress={({ nativeEvent }) => {
              onChange("defaultCommentSort", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("Default Comment Sort")}
              detail={settings.defaultCommentSort}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </CommentSortContextMenu>
          <ListingTypeContextMenu
            currentSelection={settings.defaultListingType}
            onPress={({ nativeEvent }) => {
              onChange("defaultListingType", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("Default Listing Type")}
              detail={settings.defaultListingType}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </ListingTypeContextMenu>
          <Cell
            title={t("Hide Read Posts")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ReadSettings")}
          />
        </Section>

        <Section header={t("Comments")}>
          <Cell
            cellStyle="RightDetail"
            title={t("Show Comment Actions")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showCommentActions}
                onValueChange={(v) => {
                  onChange("showCommentActions", v);
                }}
              />
            }
          />
        </Section>

        <Section
          header={t("NSFW Content")}
          footer={t("settings.content.nsfw.footer")}
        >
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.blur")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.blurNsfw}
                onValueChange={(v) => onChange("blurNsfw", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.hide")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideNsfw}
                onValueChange={(v) => onChange("hideNsfw", v)}
              />
            }
          />
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

export default ContentScreen;
