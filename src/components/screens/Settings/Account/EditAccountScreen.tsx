import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { useAccountStore } from "@src/state/account/accountStore";
import { useShowToast } from "@src/state/toast/toastStore";
import ILemmyServer from "@src/types/api/ILemmyServer";
import { getBaseUrl } from "@src/helpers/links";
import instance from "@src/Instance";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import { EInitializeResult } from "@src/api/common/ApiInstance";
import { addAccount, editAccount } from "@src/state/account/actions";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function EditAccountScreen({ route, navigation }: IProps): React.JSX.Element {
  const [form, setForm] = useState<ILemmyServer>({
    host: "",
    username: "",
    password: "",
    authToken: "",
    totpToken: "",
  });

  const [loading, setLoading] = useState(false);
  const [showTotpToken, setShowTotpToken] = useState(false);

  const edit = useRef(false);

  const { t } = useTranslation();
  const showToast = useShowToast();
  const theme = useThemeOptions();

  const { accounts } = useAccountStore.getState();

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
          a.host === route.params.instance
      );

      setForm({
        ...form,
        username: account!.username,
        host: account!.host,
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
    if (!form.host || !form.username || !form.password) {
      showToast({
        message: t("toast.allFieldsRequired"),
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    if (form.username.includes("@")) {
      showToast({
        message: t("toast.useUsername"),
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    setLoading(true);
    const serverParsed = getBaseUrl(form.host);

    const server: ILemmyServer = {
      username: form.username,
      password: form.password,
      host: serverParsed,
      totpToken: form.totpToken,
    };

    const res = await instance.initialize({
      type: "lemmy",
      host: server.host,
      username: server.username,
      password: server.password,
      totpToken: server.totpToken,
    });

    setLoading(false);

    if (res !== EInitializeResult.SUCCESS) {
      writeToLog("Error editing account.");

      if (res === EInitializeResult.TOTP) {
        setShowTotpToken(true);
        return;
      }

      return;
    }

    if (!instance.authToken) {
      setLoading(false);
      Alert.alert(t("alert.serverAuthError"));
      return;
    }

    if (edit.current) {
      editAccount({
        username: form.username,
        host: form.host,
        authToken: instance.authToken,
        fullUsername: `${form.username}@${getBaseUrl(form.host)}`,
        isCurrentAccount: true,
      });
    } else {
      addAccount({
        username: form.username,
        host: form.host,
        authToken: instance.authToken,
        fullUsername: `${form.username}@${getBaseUrl(form.host)}`,
        isCurrentAccount: true,
      });
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
          <Cell
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
                value={form.host}
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
          <Cell
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
          <Cell
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
            <Cell
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
