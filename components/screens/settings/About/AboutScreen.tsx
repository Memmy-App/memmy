import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { openLink } from "../../../../helpers/LinkHelper";
import { selectCurrentAccount } from "../../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";

function AboutScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const currentAccount = useAppSelector(selectCurrentAccount);

  const theme = useTheme();

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection>
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

export default AboutScreen;
