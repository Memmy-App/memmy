import React, { useEffect } from "react";
import { ScrollView, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Button, Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";
import { Account } from "../../../types/Account";
import { deleteAccount } from "../../../slices/accounts/accountsActions";

interface ViewAccountsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: ViewAccountsScreenProps) {
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();

  const theme = useTheme();

  const headerRight = () => (
    <Button title="Add" onPress={() => navigation.push("EditAccount")} />
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight(),
    });
  }, []);

  const onAccountPress = (account: Account) => {
    navigation.push("EditAccount", {
      username: account.username,
      instance: account.instance,
    });
  };

  const onAccountDeletePress = (account: Account) => {
    Alert.alert(
      "Are you sure?",
      `Are you sure you want to delete ${account.username}@${account.instance}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteAccount(account));
          },
        },
      ]
    );
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg}>
      <CTable>
        {accounts.map((a, i) => (
          <CSection header={`${a.username}@${a.instance}`} key={i}>
            <CCell
              cellStyle="Basic"
              title="Edit Account"
              accessory="DisclosureIndicator"
              onPress={() => onAccountPress(a)}
            />
            <CCell
              cellStyle="Basic"
              title="Delete Account"
              accessory="DisclosureIndicator"
              onPress={() => onAccountDeletePress(a)}
            />
            <CCell
              title="Push Notifications"
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              cellAccessoryView={<Switch />}
            />
          </CSection>
        ))}
      </CTable>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
