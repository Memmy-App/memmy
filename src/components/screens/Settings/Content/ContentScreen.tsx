import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SortType } from "lemmy-js-client";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store";
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
          <CCell
            cellStyle="Basic"
            title="Display Total Score"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.displayTotalScore}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("displayTotalScore", v);
                }}
              />
            }
          />
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
            cellStyle="Basic"
            title="Images Ignore Screen Height"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.ignoreScreenHeightInFeed}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("ignoreScreenHeightInFeed", v);
                }}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title="Show Instance For Usernames"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showInstanceForUsernames}
                onValueChange={(v) => onChange("showInstanceForUsernames", v)}
              />
            }
          />
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
            title="Compact View"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.compactView}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("compactView", v);
                }}
              />
            }
          />
        </CSection>

        {settings.compactView && (
          <CSection header="COMPACT">
            <CCell
              cellStyle="RightDetail"
              title="Thumbnails Position"
              detail={settings.compactThumbnailPosition}
              accessory="DisclosureIndicator"
              onPress={() => {
                const options = ["None", "Left", "Right", "Cancel"];
                const cancelButtonIndex = 3;

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                    userInterfaceStyle: theme.config.initialColorMode,
                  },
                  (index: number) => {
                    if (index === cancelButtonIndex) return;

                    dispatch(
                      setSetting({ compactThumbnailPosition: options[index] })
                    );
                  }
                );
              }}
            />
            <CCell
              cellStyle="RightDetail"
              title="Show Voting Buttons"
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              cellAccessoryView={
                <Switch
                  value={settings.compactShowVotingButtons}
                  onValueChange={(v) => onChange("compactShowVotingButtons", v)}
                />
              }
            />
          </CSection>
        )}
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
