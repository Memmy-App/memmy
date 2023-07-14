import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, useTheme } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Button, Switch } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { IconLogout } from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
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
import { concealableText } from "../../../../helpers/TextHelper";
import useFaceId from "../../../../hooks/app/useFaceId";

interface ViewAccountsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

function ViewAccountsScreen({ navigation }: ViewAccountsScreenProps) {
  const accounts = useAppSelector(selectAccounts);
  const { pushEnabled, hideUsername } = useAppSelector(selectSettings);

  const [pushEnabledArr, setPushEnabledArr] = useState([]);

  const dispatch = useAppDispatch();
  const { authenticateFaceId } = useFaceId();

  const { t } = useTranslation();
  const theme = useTheme();
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
      color={theme.colors.app.accent}
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
        `${concealableText(account.username, hideUsername)}@${
          account.instance
        }`,
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

  const onHideUsernameSwitch = (value: boolean) => {
    if (!value) {
      authenticateFaceId().then((result) => {
        if (result.success) {
          dispatch(setSetting({ hideUsername: value }));
        } else {
          Alert.alert(t("faceId.failed"));
        }
      });
    } else {
      dispatch(setSetting({ hideUsername: value }));
    }
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg}>
      <LoadingModalTransparent loading={notifications.loading} />
      <CTable>
        <CSection header={t("settings.accounts.current")}>
          <CCell
            cellStyle="RightDetail"
            title={t("Server")}
            detail={accounts[0].instance}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="RightDetail"
            title={t("Username")}
            detail={concealableText(accounts[0].username, hideUsername)}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </CSection>
        {accounts.map((account) => (
          <CSection
            header={`${concealableText(account.username, hideUsername)}@${
              account.instance
            }`}
            key={account.username + account.instance}
          >
            <CCell
              cellStyle="Basic"
              title={t("Edit Account")}
              accessory="DisclosureIndicator"
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              onPress={() => onAccountPress(account)}
            />
            <CCell
              title={t("Push Notifications")}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
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
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              cellAccessoryView={
                <IconLogout color={theme.colors.app.textSecondary} />
              }
              onPress={() => onAccountLogoutPress(account)}
            />
          </CSection>
        ))}
        <CSection header={t("settings.accounts.other.header")}>
          <CCell
            title={t("settings.accounts.other.hideUsername")}
            detail={t("settings.accounts.other.hideUsernameFooter")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={hideUsername}
                onValueChange={(value) => onHideUsernameSwitch(value)}
              />
            }
          >
            <Text
              ml={4}
              mb={2}
              mt={-3}
              mr={12}
              fontSize="xs"
              color={theme.colors.app.textSecondary}
            >
              {t("settings.accounts.other.hideUsernameFooter")}
            </Text>
          </CCell>
        </CSection>
      </CTable>
    </ScrollView>
  );
}

export default ViewAccountsScreen;
