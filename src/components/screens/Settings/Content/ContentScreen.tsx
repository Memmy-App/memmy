import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { overallSortOptions } from "../../../../types/SortOptions";
import { CommentSortContextMenu } from "../../../common/ContextMenu/CommentSortContextMenu";
import { FeedSortContextMenu } from "../../../common/ContextMenu/FeedSortContextMenu";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function ContentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
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
        <CSection
          header={t("Posts")}
          footer={t("settings.content.markRead.footer")}
        >
          {/* <CCell */}
          {/*  title="Swipe Gestures" */}
          {/*  backgroundColor={theme.colors.app.fg} */}
          {/*  titleTextColor={theme.colors.app.textPrimary} */}
          {/*  rightDetailColor={theme.colors.app.textSecondary} */}
          {/*  cellAccessoryView={ */}
          {/*    <Switch */}
          {/*      value={Settings.swipeGestures} */}
          {/*      onValueChange={(v) => onChange("swipeGestures", v)} */}
          {/*    /> */}
          {/*  } */}
          {/* /> */}
          <FeedSortContextMenu
            currentSelection={settings.defaultSort}
            onPress={({ nativeEvent }) => {
              dispatch(setSetting({ defaultSort: nativeEvent.actionKey }));
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Sort")}
              detail={overallSortOptions[settings.defaultSort].display}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              accessory="DisclosureIndicator"
            />
          </FeedSortContextMenu>
          <CommentSortContextMenu
            currentSelection={settings.defaultCommentSort}
            onPress={({ nativeEvent }) => {
              dispatch(
                setSetting({ defaultCommentSort: nativeEvent.actionKey })
              );
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Comment Sort")}
              detail={settings.defaultCommentSort}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              accessory="DisclosureIndicator"
            />
          </CommentSortContextMenu>
          <ListingTypeContextMenu
            currentSelection={settings.defaultListingType}
            onPress={({ nativeEvent }) => {
              dispatch(
                setSetting({ defaultListingType: nativeEvent.actionKey })
              );
            }}
          >
            <CCell
              cellStyle="RightDetail"
              title={t("Default Listing Type")}
              detail={settings.defaultListingType}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              accessory="DisclosureIndicator"
            />
          </ListingTypeContextMenu>
          <CCell
            title={t("Mark Post Read On")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ReadSettings")}
          />
          <CCell
            cellStyle="RightDetail"
            title={t("Hide Read Posts on Feed")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
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
            title={t("Show Hide Read Button")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
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

        <CSection header={t("Comments")}>
          <CCell
            cellStyle="RightDetail"
            title={t("Show Comment Actions")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showCommentActions}
                onValueChange={(v) => {
                  onChange("showCommentActions", v);
                }}
              />
            }
          />
        </CSection>

        <CSection
          header={t("NSFW Content")}
          footer={t("settings.content.nsfw.footer")}
        >
          <CCell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.blur")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.blurNsfw}
                onValueChange={(v) => onChange("blurNsfw", v)}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title={t("settings.content.nsfw.hide")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideNsfw}
                onValueChange={(v) => onChange("hideNsfw", v)}
              />
            }
          />
        </CSection>
        <CSection header="Web">
          <CCell
            cellStyle="Basic"
            title={t("settings.content.web.useReaderMode")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.useReaderMode}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("useReaderMode", v);
                }}
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

export default ContentScreen;
