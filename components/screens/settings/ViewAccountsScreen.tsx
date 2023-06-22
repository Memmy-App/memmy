import React, { useCallback, useEffect } from "react";
import { ScrollView, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "react-native";
import { useAppSelector } from "../../../store";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";
import { Account } from "../../../types/Account";

interface ViewAccountsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: ViewAccountsScreenProps) {
  const accounts = useAppSelector(selectAccounts);

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

  return (
    <ScrollView backgroundColor={theme.colors.app.backgroundSecondary}>
      <CTable>
        <CSection header="ACCOUNTS">
          {accounts.map((a, i) => (
            <CCell
              key={i}
              cellStyle="Basic"
              title={`${a.username}@${a.instance}`}
              accessory="DisclosureIndicator"
              onPress={() => onAccountPress(a)}
            />
          ))}
        </CSection>
      </CTable>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
