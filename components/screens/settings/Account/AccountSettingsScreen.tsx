import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { selectAccounts } from "../../../../slices/accounts/accountsSlice";
import { useAppSelector } from "../../../../store";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";

function AccountSettingsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const accounts = useAppSelector(selectAccounts);
  const theme = useTheme();

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection>
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

export default AccountSettingsScreen;
