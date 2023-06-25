import React from "react";
import { ScrollView, useTheme } from "native-base";
import { Alert, StyleSheet, Switch } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { setSetting } from "../../../slices/settings/settingsActions";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import CCell from "../../ui/table/CCell";
import CSection from "../../ui/table/CSection";
import { deleteLog, sendLog } from "../../../helpers/LogHelper";

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
          <Cell
            cellStyle="RightDetail"
            title="Server"
            detail={accounts[0].instance}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <Cell
            cellStyle="RightDetail"
            title="Username"
            detail={accounts[0].username}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />

          <Cell
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

        <Section header="APPEARANCE" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title="Theme"
            detail={settings.theme}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = ["Brown", "Light", "Dark", "Purple", "Cancel"];
              const cancelButtonIndex = 4;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  dispatch(setSetting({ theme: options[index] }));

                  Alert.alert(
                    "Please Restart",
                    "Some components may not re-render with the new theme. Please restart the app to get the full effect."
                  );
                }
              );
            }}
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
                onValueChange={(v) => onChange("compactView", v)}
              />
            }
          />
        </Section>

        <Section header="ABOUT" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title="Version"
            detail={`${getVersion()} (${getBuildNumber()})`}
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
