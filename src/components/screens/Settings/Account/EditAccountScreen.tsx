import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { Section, TableView } from "@gkasdorf/react-native-tableview-simple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@root/store";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import { writeToLog } from "../../../../helpers/LogHelper";
import {
  getInstanceError,
  initialize,
  lemmyAuthToken,
} from "../../../../LemmyInstance";
import {
  addAccount,
  editAccount,
} from "../../../../slices/accounts/accountsActions";
import { selectAccounts } from "../../../../slices/accounts/accountsSlice";
import CCell from "../../../common/Table/CCell";
import { showToast } from "../../../../slices/toast/toastSlice";
import ILemmyServer from "../../../../types/lemmy/ILemmyServer";

function EditAccountScreen({
  route,
  navigation,
}: {
  route;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [form, setForm] = useState<ILemmyServer>({
    server: "",
    username: "",
    password: "",
    auth: "",
    totpToken: "",
  });

  const [loading, setLoading] = useState(false);
  const [showTotpToken, setShowTotpToken] = useState(false);

  const edit = useRef(false);

  const { t } = useTranslation();
  const theme = useThemeOptions();
  const dispatch = useAppDispatch();

  const accounts = useAppSelector(selectAccounts);

  const headerRight = () => (
    <Button
      title={t("Save")}
      onPress={onSavePress}
      disabled={loading}
      color={theme.colors.accent}
    />
  );

  useEffect(() => {
    if (route.params && route.params.username) {
      const account = accounts.find(
        (a) =>
          a.username === route.params.username &&
          a.instance === route.params.instance
      );

      setForm({
        ...form,
        username: account.username,
        password: account.password,
        server: account.instance,
      });

      edit.current = true;
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight(),
    });
  }, [form, loading]);

  const onFormChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSavePress = async () => {
    if (!form.server || !form.username || !form.password) {
      dispatch(
        showToast({
          message: t("toast.allFieldsRequired"),
          duration: 3000,
          variant: "warn",
        })
      );
      return;
    }

    if (form.username.includes("@")) {
      dispatch(
        showToast({
          message: t("toast.useUsername"),
          duration: 3000,
          variant: "warn",
        })
      );
      return;
    }

    setLoading(true);
    const serverParsed = getBaseUrl(form.server);

    const server: ILemmyServer = {
      username: form.username,
      password: form.password,
      server: serverParsed,
      totpToken: form.totpToken,
    };

    const success = await initialize(server);

    setLoading(false);

    if (!success) {
      writeToLog("Error editing account.");
      writeToLog(getInstanceError());

      if (getInstanceError() === "missing_totp_token") {
        setShowTotpToken(true);
        return;
      }

      return;
    }

    if (!lemmyAuthToken) {
      setLoading(false);
      Alert.alert(t("alert.serverAuthError"));
      return;
    }

    if (edit.current) {
      dispatch(
        editAccount({
          username: form.username,
          password: form.password,
          token: lemmyAuthToken,
          instance: form.server,
        })
      );
    } else {
      dispatch(
        addAccount({
          username: form.username,
          password: form.password,
          token: lemmyAuthToken,
          instance: form.server,
        })
      );
    }

    navigation.pop();
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.bg }}
      keyboardShouldPersistTaps="handled"
    >
      <TableView style={styles.table}>
        <Section
          header={t("settings.accounts.server.header")}
          roundedCorners
          hideSurroundingSeparators
          footer={t("settings.accounts.server.footer")}
        >
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: !edit.current
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary,
                }}
                placeholderTextColor={theme.colors.textSecondary}
                placeholder={t("settings.accounts.server.placeholder")}
                value={form.server}
                onChangeText={(text) => onFormChange("server", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!edit.current}
                keyboardAppearance={theme.config.initialColorMode}
                keyboardType="web-search"
              />
            }
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
        </Section>

        <Section
          header={t("settings.accounts.credentials.header")}
          roundedCorners
          hideSurroundingSeparators
          footer={t("settings.accounts.credentials.footer")}
        >
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: !edit.current
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary,
                }}
                placeholderTextColor={theme.colors.textSecondary}
                placeholder={t("Username")}
                value={form.username}
                onChangeText={(text) => onFormChange("username", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!edit.current}
                keyboardAppearance={theme.config.initialColorMode}
              />
            }
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: theme.colors.textPrimary,
                }}
                placeholderTextColor={theme.colors.textSecondary}
                placeholder={t("Password")}
                value={form.password}
                onChangeText={(text) => onFormChange("password", text)}
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry
                keyboardAppearance={theme.config.initialColorMode}
              />
            }
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          {showTotpToken && (
            <CCell
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.textPrimary,
                  }}
                  placeholderTextColor={theme.colors.textSecondary}
                  placeholder={t("2FA Token")}
                  value={form.totpToken}
                  onChangeText={(text) => onFormChange("totpToken", text)}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry
                  autoFocus={showTotpToken}
                  keyboardAppearance={theme.config.initialColorMode}
                />
              }
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            />
          )}
        </Section>
      </TableView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  table: {
    marginHorizontal: 15,
  },
});

export default EditAccountScreen;
