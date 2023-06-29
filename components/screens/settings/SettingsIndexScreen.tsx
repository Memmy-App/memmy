import { useActionSheet } from "@expo/react-native-action-sheet";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { Badge, Box, HStack, ScrollView, Text, useTheme } from "native-base";
import React from "react";
import { Alert, LayoutAnimation, StyleSheet, Switch } from "react-native";
import { getBuildNumber, getVersion } from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { Section, TableView } from "react-native-tableview-simple";
import { deleteLog, sendLog } from "../../../helpers/LogHelper";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import { setSetting } from "../../../slices/settings/settingsActions";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { HapticOptionsArr } from "../../../types/haptics/hapticOptions";
import CCell from "../../ui/table/CCell";
import CSection from "../../ui/table/CSection";

function SettingsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const settings = useAppSelector(selectSettings);
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <Section header="ACCOUNT" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title="Server"
            detail={accounts[0].instance}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="RightDetail"
            title="Username"
            detail={accounts[0].username}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />

          <CCell
            cellStyle="Basic"
            title="Change Account Settings"
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ViewAccounts")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </Section>

        <Section
          header="NSFW CONTENT"
          footer="This toggle does not affect your Lemmy account NSFW settings. This local setting will apply only to the app and will apply to all accounts."
          roundedCorners
          hideSurroundingSeparators
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
        </Section>

        <Section header="Text Size" roundedCorners hideSurroundingSeparators>
          <CCell
            title="Use System Text Size"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.isSystemTextSize}
                onValueChange={(v) => onChange("isSystemTextSize", v)}
              />
            }
          />
          <CCell
            isDisabled={settings.isSystemTextSize}
            title={
              <Text>
                Text Size{"  "}
                <Badge colorScheme="info" variant="outline">
                  Alpha
                </Badge>
              </Text>
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          >
            <HStack width="100%" alignItems="center" px={6}>
              <Text fontSize={13}>A</Text>
              <Box flex={1}>
                <Slider
                  disabled={settings.isSystemTextSize}
                  style={{ height: 40, marginHorizontal: 20, marginBottom: 5 }}
                  minimumValue={1}
                  maximumValue={7}
                  thumbTintColor={theme.colors.app.textPrimary}
                  minimumTrackTintColor={theme.colors.app.textPrimary}
                  maximumTrackTintColor={theme.colors.app.textPrimary}
                  step={1}
                  value={settings.fontSize}
                  onSlidingComplete={(v) => onChange("fontSize", v)}
                />
              </Box>
              <Text fontSize={19}>A</Text>
            </HStack>
          </CCell>
        </Section>

        <Section header="APPEARANCE" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="Basic"
            title="Themes"
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ThemeSelection")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            title="Swipe Gestures"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.swipeGestures}
                onValueChange={(v) => onChange("swipeGestures", v)}
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
            detail={settings.defaultSort}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [
                "Top Day",
                "Top Week",
                "Hot",
                "New",
                "Most Comments",
                "Cancel",
              ];
              const cancelButtonIndex = 5;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  let selection;

                  if (index === 0) {
                    selection = "TopDay";
                  } else if (index === 1) {
                    selection = "TopWeek";
                  } else if (index === 4) {
                    selection = "MostComments";
                  } else {
                    selection = options[index];
                  }

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
        </Section>

        {settings.compactView && (
          <Section header="COMPACT" roundedCorners hideSurroundingSeparators>
            <CCell
              cellStyle="RightDetail"
              title="Thumbnails Position"
              detail={settings.compactThumbnailPosition}
              accessory="DisclosureIndicator"
              onPress={() => {
                const options = ["Left", "Right", "Cancel"];
                const cancelButtonIndex = 2;

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
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
          </Section>
        )}

        <Section header="HAPTICS" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title="Strength"
            detail={settings.haptics}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [...HapticOptionsArr, "Cancel"];
              const cancelButtonIndex = options.length - 1;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  dispatch(setSetting({ haptics: options[index] }));
                }
              );
            }}
          />
        </Section>

        <Section header="ABOUT" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title="Version"
            detail={`${getVersion()} (${getBuildNumber()})`}
          />
          <CCell
            cellStyle="Basic"
            title="License"
            accessory="DisclosureIndicator"
            onPress={() =>
              navigation.push("Viewer", {
                type: "license",
              })
            }
          />
          <CCell
            cellStyle="Basic"
            title="License Acknowledgements"
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("Viewer", {
                type: "acknowledgements",
              });
            }}
          />
          <CCell
            cellStyle="Basic"
            title="Privacy Policy"
            accessory="DisclosureIndicator"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://memmy.app/privacy.txt");
            }}
          />
        </Section>

        <CSection header="DEBUG">
          <CCell
            cellStyle="Basic"
            title="Email Debug Log"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              sendLog()
                .then()
                .catch((e) => {
                  if (e.toString() === "Error: no_file") {
                    Alert.alert("No debug file exists.");
                  } else {
                    console.log(e);
                    Alert.alert(e.toString());
                  }
                });
            }}
          />
          <CCell
            cellStyle="Basic"
            title="Clear Debug Log"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              try {
                deleteLog();
                Alert.alert("Debug file cleared.");
              } catch (e) {
                console.log(e.toString());
              }
            }}
          />
          <CCell
            cellStyle="Basic"
            title="Clear Cache"
            accessory="DisclosureIndicator"
            onPress={() =>
              FastImage.clearDiskCache().then(
                Alert.alert("Success", "Cache has been cleared.")
              )
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

export default SettingsIndexScreen;
