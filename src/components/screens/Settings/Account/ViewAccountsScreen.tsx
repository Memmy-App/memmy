import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Button, Switch } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { selectAccounts } from "../../../../slices/accounts/accountsSlice";
import CTable from "../../../common/Table/CTable";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";
import { Account } from "../../../../types/Account";
import { deleteAccount } from "../../../../slices/accounts/accountsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import useNotifications from "../../../../hooks/notifications/useNotifications";
import LoadingModalTransparent from "../../../common/Loading/LoadingModalTransparent";
import { setSetting } from "../../../../slices/settings/settingsActions";

interface ViewAccountsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: ViewAccountsScreenProps) {
  const accounts = useAppSelector(selectAccounts);
  const { pushEnabled } = useAppSelector(selectSettings);

  const [pushEnabledArr, setPushEnabledArr] = useState([]);

  const dispatch = useAppDispatch();

  const theme = useTheme();
  const notifications = useNotifications();

  useFocusEffect(
    useCallback(() => {
      setPushEnabledArr(JSON.parse(pushEnabled));
    }, [])
  );

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
      `Please make sure push notifications are disabled before deleting an account, otherwise you may 
      continue to get push notifications for that account.\n\nAre you sure you want to 
      delete ${account.username}@${account.instance}?`,
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

  const onPushNotificationsSwitch = (account: Account, value: boolean) => {
    if (value) {
      Alert.alert(
        "Info",
        "To make push notifications work, Memmy has to send your authentication token " +
          "to our server. Right now, this is the only viable way to allow users to receive push notifications. Note that " +
          "Memmy servers do NOT have access to your password, only your authentication token. Authentication tokens may " +
          "be revoked by changing your password.\n\nFull source code for the Memmy push notification server is available " +
          "at https://github.com/gkasdorf/memmy-push.\n\nDo you wish to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Continue",
            style: "default",
            onPress: () => onEnableNotifications(account),
          },
        ]
      );
    } else {
      onDisableNotifications(account);
    }
  };

  const onEnableNotifications = async (account: Account) => {
    const res = await notifications.enable(account);

    if (!res.result) {
      Alert.alert("Error", res.message);
    }

    dispatch(
      setSetting({
        pushEnabled: JSON.stringify([
          ...pushEnabledArr,
          { username: account.username, instance: account.instance },
        ]),
      })
    );

    setPushEnabledArr((prev) => [
      ...prev,
      { username: account.username, instance: account.instance },
    ]);
  };

  const onDisableNotifications = async (account: Account) => {
    const res = await notifications.disable(account);

    if (!res.result) {
      Alert.alert("Error", res.message);
    }

    dispatch(
      setSetting({
        pushEnabled: JSON.stringify(
          pushEnabledArr.map(
            (x) =>
              x.username !== account.username && x.instance !== account.instance
          )
        ),
      })
    );

    setPushEnabledArr((prev) =>
      prev.map(
        (x) =>
          x.username !== account.username && x.instance !== account.instance
      )
    );
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg}>
      <LoadingModalTransparent loading={notifications.loading} />
      <CTable>
        <CSection header="CURRENT ACCOUNT">
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
        </CSection>
        {accounts.map((a) => (
          <CSection
            header={`${a.username}@${a.instance}`.toUpperCase()}
            key={`${a.username}${a.instance}`}
          >
            <CCell
              cellStyle="Basic"
              title="Edit Account"
              accessory="DisclosureIndicator"
              onPress={() => onAccountPress(a)}
            />
            {accounts.length > 1 && (
              <CCell
                cellStyle="Basic"
                title="Delete Account"
                accessory="DisclosureIndicator"
                onPress={() => onAccountDeletePress(a)}
              />
            )}
            <CCell
              title="Push Notifications"
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              cellAccessoryView={
                <Switch
                  value={
                    pushEnabledArr.findIndex(
                      (pe) =>
                        pe.username === a.username && pe.instance === a.instance
                    ) > -1
                  }
                  onValueChange={(v) => onPushNotificationsSwitch(a, v)}
                />
              }
            />
          </CSection>
        ))}
      </CTable>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
