import { useActionSheet } from "@expo/react-native-action-sheet";
import { Section, TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { getBuildNumber, getVersion } from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { openLink } from "../../../helpers/LinkHelper";
import { deleteLog, sendLog, writeToLog } from "../../../helpers/LogHelper";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { setSetting } from "../../../slices/settings/settingsActions";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import { HapticOptionsArr } from "../../../types/haptics/hapticOptions";
import CCell from "../../ui/table/CCell";

function SettingsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const settings = useAppSelector(selectSettings);

  const currentAccount = useAppSelector(selectCurrentAccount);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onCacheClear = async () => {
    await FastImage.clearDiskCache();
    Alert.alert("Success", "Cache has been cleared.");
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <Section roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="Basic"
            title="Content"
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Content")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title="Appearance"
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Appearance")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title="Account"
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("AccountSettings")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </Section>

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
            title="Acknowledgements"
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
          <CCell
            cellStyle="Basic"
            title="Terms of Use"
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("Viewer", {
                type: "terms",
              });
            }}
          />
          <CCell
            cellStyle="Basic"
            title="GitHub"
            accessory="DisclosureIndicator"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://github.com/gkasdorf/memmy");
            }}
          />
          <CCell
            cellStyle="Basic"
            title="Delete Account"
            accessory="DisclosureIndicator"
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "To remove all data from Memmy's servers, simply disable push " +
                  "notifications. If you do not have push notifications enabled, we do not have any of your data.\n\n" +
                  `To delete your Lemmy account, you must first visit ${currentAccount.instance} and sign in.` +
                  " Then " +
                  ' navigate to the Profile tab. You may delete your account by pressing "Delete Account".',
                [
                  {
                    text: "Visit Instance",
                    onPress: () => {
                      openLink(
                        `https://${currentAccount.instance}`,
                        navigation
                      );
                    },
                  },
                  {
                    text: "OK",
                    style: "default",
                  },
                ]
              );
            }}
          />
        </Section>

        <Section header="DEBUG" roundedCorners hideSurroundingSeparators>
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
                writeToLog("Error clearing debug file.");
              }
            }}
          />
          <CCell
            cellStyle="Basic"
            title="Clear Cache"
            accessory="DisclosureIndicator"
            onPress={() => {
              // TODO this is a hack to shut eslint up. PR was merged to accept promises here, so we can upgrade to the
              // version on git or just remove this table stuff and use the new MTable
              onCacheClear();
            }}
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

export default SettingsIndexScreen;
