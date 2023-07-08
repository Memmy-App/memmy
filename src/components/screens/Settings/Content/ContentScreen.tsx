import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SortType } from "lemmy-js-client";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { SortOption, sortOptions } from "../../../../types/FeedSortOptions";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function ContentScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const settings = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  const getDefaultSortText = (sortType: SortType): string => {
    const index = sortOptions.map((x: SortOption) => x[0]).indexOf(sortType);
    return sortOptions[index][1];
  };

  const getDefaultSortFromText = (sortType: string): SortType => {
    const index = sortOptions.map((x: SortOption) => x[1]).indexOf(sortType);
    return sortOptions[index][0];
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header="POSTS">
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
          <CCell
            cellStyle="RightDetail"
            title="Default Sort"
            detail={getDefaultSortText(settings.defaultSort)}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [
                "Top Hour",
                "Top Six Hours",
                "Top Twelve Hours",
                "Hot",
                "Active",
                "New",
                "Most Comments",
                "Cancel",
              ];
              const cancelButtonIndex = 6;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  const selection = getDefaultSortFromText(options[index]);
                  dispatch(setSetting({ defaultSort: selection }));
                }
              );
            }}
          />
          <CCell
            cellStyle="RightDetail"
            title="Default Comment Sort"
            detail={settings.defaultCommentSort}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = ["Hot", "Top", "New", "Old", "Cancel"];
              const cancelButtonIndex = options.length - 1;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  const selection = options[index];
                  dispatch(setSetting({ defaultCommentSort: selection }));
                }
              );
            }}
          />
          <CCell
            cellStyle="RightDetail"
            title="Default Listing Type"
            detail={settings.defaultListingType}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = ["All", "Local", "Subscribed", "Cancel"];
              const cancelButtonIndex = 3;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  dispatch(setSetting({ defaultListingType: options[index] }));
                }
              );
            }}
          />
          <CCell
            title="Mark Post Read On..."
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ReadSettings")}
          />
          <CCell
            cellStyle="RightDetail"
            title="Hide Read Posts on Feed"
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
        </CSection>

        <CSection header="COMMENTS">
          <CCell
            cellStyle="RightDetail"
            title="Show Comment Actions"
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
          header="NSFW CONTENT"
          footer="This toggle does not affect your Lemmy account NSFW settings. This local setting will apply only to the app and will apply to all accounts."
        >
          <CCell
            cellStyle="RightDetail"
            title="Blur NSFW"
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
            title="Hide NSFW"
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
            title="Use Reader Mode"
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
