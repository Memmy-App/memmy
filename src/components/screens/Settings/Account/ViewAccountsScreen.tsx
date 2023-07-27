import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Switch } from "react-native";
import setSetting from "@src/stores/settings/actions/setSetting";
import useNotifications from "../../../../hooks/notifications/useNotifications";
import { deleteAccount } from "../../../../slices/accounts/accountsActions";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../../slices/accounts/accountsSlice";
import { Account } from "../../../../types/Account";
import LoadingModalTransparent from "../../../common/Loading/LoadingModalTransparent";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import CTable from "../../../common/Table/CTable";
import SFIcon from "../../../common/icons/SFIcon";
import { ICON_MAP } from "../../../../constants/IconMap";

interface ViewAccountsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: ViewAccountsScreenProps) {
  const accounts = useAppSelector(selectAccounts);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const pushEnabled = useAppSelector((state) => state.settings.pushEnabled);

  const [pushEnabledArr, setPushEnabledArr] = useState([]);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);
  const notifications = useNotifications();

  useFocusEffect(
    useCallback(() => {
      setPushEnabledArr(JSON.parse(pushEnabled));
    }, [])
  );

  const headerRight = () => (
    <Button
      title={t("Add")}
      onPress={() => navigation.push("EditAccount")}
      color={theme.colors.accent}
    />
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

  const onAccountLogoutPress = (account: Account) => {
    Alert.alert(
      t("alert.title.areYouSure"),
      t("alert.message.accountLogoutConfirm", [
        `${account.username}@${account.instance}`,
      ]),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Logout"),
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
        t("alert.title.info"),
        t("alert.message.pushNotificationsConfirm"),
        [
          {
            text: t("Cancel"),
            style: "cancel",
          },
          {
            text: t("Continue"),
            style: "destructive",
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

    setSetting({
      pushEnabled: JSON.stringify([
        ...pushEnabledArr,
        { username: account.username, instance: account.instance },
      ]),
    }).then();

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

    setSetting({
      pushEnabled: JSON.stringify(
        pushEnabledArr.map(
          (x) =>
            x.username !== account.username && x.instance !== account.instance
        )
      ),
    }).then();

    setPushEnabledArr((prev) =>
      prev.map(
        (x) =>
          x.username !== account.username && x.instance !== account.instance
      )
    );
  };

  return (
    <ScrollView bg={theme.colors.bg}>
      <LoadingModalTransparent loading={notifications.loading} />
      <CTable>
        <CSection
          header={t("settings.accounts.current")}
          footer="To switch accounts, simply press and hold the Profile button in the tab bar."
        >
          <CCell
            cellStyle="RightDetail"
            title={t("Server")}
            detail={currentAccount.instance}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="RightDetail"
            title={t("Username")}
            detail={currentAccount.username}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
        </CSection>
        {accounts.map((account) => (
          <CSection
            header={`${account.username}@${account.instance}`}
            key={account.username + account.instance}
          >
            <CCell
              cellStyle="Basic"
              title={t("Edit Account")}
              accessory="DisclosureIndicator"
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              onPress={() => onAccountPress(account)}
            />
            <CCell
              title={t("Push Notifications")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              cellAccessoryView={
                <Switch
                  value={
                    pushEnabledArr.findIndex(
                      (pe) =>
                        pe.username === account.username &&
                        pe.instance === account.instance
                    ) > -1
                  }
                  onValueChange={(v) => onPushNotificationsSwitch(account, v)}
                />
              }
            />
            <CCell
              cellStyle="Basic"
              title={t("Logout")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              cellAccessoryView={
                <SFIcon
                  icon={ICON_MAP.LOGOUT}
                  color={theme.colors.textSecondary}
                  size={14}
                />
              }
              onPress={() => onAccountLogoutPress(account)}
            />
          </CSection>
        ))}
      </CTable>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
