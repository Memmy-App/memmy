import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView } from "@src/components/gluestack";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Switch } from "react-native";
import {
  useAccountStore,
  useCurrentAccount,
} from "@src/state/account/accountStore";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import useNotifications from "@src/hooks/notifications/useNotifications";
import IAccount from "@src/types/IAccount";
import { deleteAccount } from "@src/state/account/actions";
import { setSetting } from "@src/state/settings/actions";
import LoadingModal from "@src/components/common/Loading/LoadingModal";
import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { ICON_MAP } from "@src/types/constants/IconMap";
import SFIcon from "../../../common/icons/SFIcon";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: IProps): React.JSX.Element {
  const accounts = useAccountStore((state) => state.accounts);
  const currentAccount = useCurrentAccount();
  const pushEnabled = useSettingsStore((state) => state.pushEnabled);

  const [pushEnabledArr, setPushEnabledArr] = useState<object[]>([]);

  const { t } = useTranslation();
  const theme = useThemeOptions();
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

  const onAccountPress = (account: IAccount) => {
    navigation.push("EditAccount", {
      username: account.username,
      instance: account.host,
    });
  };

  const onAccountLogoutPress = (account: IAccount) => {
    Alert.alert(
      t("alert.title.areYouSure"),
      t("alert.message.accountLogoutConfirm", [
        `${account.username}@${account.host}`,
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
            deleteAccount(account);
          },
        },
      ]
    );
  };

  const onPushNotificationsSwitch = (account: IAccount, value: boolean) => {
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

  const onEnableNotifications = async (account: IAccount) => {
    const res = await notifications.enable(account);

    if (!res.result) {
      Alert.alert("Error", res.message);
    }

    setSetting("pushEnabled", [
      ...pushEnabledArr,
      { username: account.username, instance: account.host },
    ]);

    setPushEnabledArr((prev) => [
      ...prev,
      { username: account.username, instance: account.host },
    ]);
  };

  const onDisableNotifications = async (account: IAccount) => {
    const res = await notifications.disable(account);

    if (!res.result) {
      Alert.alert("Error", res.message);
    }

    setSetting(
      "pushEnabled",
      pushEnabledArr.filter(
        (x: any) => x.username !== account.username && x.host !== account.host
      )
    );

    setPushEnabledArr((prev: any) =>
      prev.map(
        (x: any) =>
          x.username !== account.username && x.instance !== account.host
      )
    );
  };

  return (
    <ScrollView bg={theme.colors.bg}>
      <LoadingModal loading={notifications.loading} />
      <TableView>
        <Section
          header={t("settings.accounts.current")}
          footer="To switch accounts, simply press and hold the Profile button in the tab bar."
        >
          <Cell
            cellStyle="RightDetail"
            title={t("Server")}
            detail={currentAccount?.host}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <Cell
            cellStyle="RightDetail"
            title={t("Username")}
            detail={currentAccount?.username}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
        </Section>
        {accounts.map((account) => (
          <Section
            header={`${account.username}@${account.host}`}
            key={account.username + account.host}
          >
            <Cell
              cellStyle="Basic"
              title={t("Edit Account")}
              accessory="DisclosureIndicator"
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              onPress={() => onAccountPress(account)}
            />
            <Cell
              title={t("Push Notifications")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              cellAccessoryView={
                <Switch
                  value={
                    pushEnabledArr.findIndex(
                      (pe: any) =>
                        pe.username === account.username &&
                        pe.instance === account.host
                    ) > -1
                  }
                  onValueChange={(v) => onPushNotificationsSwitch(account, v)}
                />
              }
            />
            <Cell
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
          </Section>
        ))}
      </TableView>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
