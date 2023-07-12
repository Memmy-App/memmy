import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { useTranslation } from "react-i18next";
import { openLink } from "../../../../helpers/LinkHelper";
import { selectCurrentAccount } from "../../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../../store";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";

function AboutScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const currentAccount = useAppSelector(selectCurrentAccount);

  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection>
          <CCell
            cellStyle="RightDetail"
            title={t("Version")}
            detail={`${getVersion()} (${getBuildNumber()})`}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={t("License")}
            accessory="DisclosureIndicator"
            onPress={() =>
              navigation.push("Viewer", {
                type: "license",
              })
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={t("Acknowledgements")}
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("Viewer", {
                type: "acknowledgements",
              });
            }}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={t("Privacy Policy")}
            accessory="DisclosureIndicator"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://memmy.app/privacy.txt");
            }}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={t("Terms of Use")}
            accessory="DisclosureIndicator"
            onPress={() => {
              navigation.push("Viewer", {
                type: "terms",
              });
            }}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title="GitHub"
            accessory="DisclosureIndicator"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://github.com/gkasdorf/memmy");
            }}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={t("Delete Account")}
            accessory="DisclosureIndicator"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            onPress={() => {
              Alert.alert(
                t("alert.title.deleteAccount"),
                t("alert.message.deleteAccountConfirm", [
                  currentAccount.instance,
                ]),
                [
                  {
                    text: "Visit Instance",
                    onPress: () => {
                      openLink(
                        `https://${currentAccount.instance}`,
                        navigation,
                        theme.colors.app.bg
                      );
                    },
                  },
                  {
                    text: t("OK"),
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
