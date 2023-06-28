import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VStack, useTheme, useToast } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { Section, TableView } from "react-native-tableview-simple";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { writeToLog } from "../../../helpers/LogHelper";
import {
  getInstanceError,
  initialize,
  lemmyAuthToken,
} from "../../../lemmy/LemmyInstance";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {
  addAccount,
  editAccount,
} from "../../../slices/accounts/accountsActions";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import CCell from "../../ui/table/CCell";

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

  const toast = useToast();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const accounts = useAppSelector(selectAccounts);

  const headerRight = () => (
    <Button title="Save" onPress={onSavePress} disabled={loading} />
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
      toast.show({
        description: "All fields are required.",
        duration: 3000,
      });
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

      Alert.alert("Error", getInstanceError());
      return;
    }

    if (!lemmyAuthToken) {
      setLoading(false);
      Alert.alert("Error authenticating with server.");
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
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <TableView style={styles.table}>
        <Section
          header="SERVER ADDRESS"
          roundedCorners
          hideSurroundingSeparators
          footer="URL for the server you wish to connect"
        >
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: !edit.current
                    ? theme.colors.app.textPrimary
                    : theme.colors.app.textSecondary,
                }}
                placeholderTextColor={theme.colors.app.textSecondary}
                placeholder="Server Address"
                value={form.server}
                onChangeText={(text) => onFormChange("server", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!edit.current}
                keyboardAppearance={theme.config.initialColorMode}
              />
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </Section>

        <Section
          header="SERVER CREDENTIALS"
          roundedCorners
          hideSurroundingSeparators
          footer="Credentials for the server you are connecting."
        >
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: !edit.current
                    ? theme.colors.app.textPrimary
                    : theme.colors.app.textSecondary,
                }}
                placeholderTextColor={theme.colors.app.textSecondary}
                placeholder="Username"
                value={form.username}
                onChangeText={(text) => onFormChange("username", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!edit.current}
                keyboardAppearance={theme.config.initialColorMode}
              />
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellContentView={
              <TextInput
                style={{
                  fontSize: 16,
                  flex: 1,
                  color: theme.colors.app.textPrimary,
                }}
                placeholderTextColor={theme.colors.app.textSecondary}
                placeholder="Password"
                value={form.password}
                onChangeText={(text) => onFormChange("password", text)}
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry
                keyboardAppearance={theme.config.initialColorMode}
              />
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          {showTotpToken && (
            <CCell
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.app.textPrimary,
                  }}
                  placeholderTextColor={theme.colors.app.textSecondary}
                  placeholder="2FA Token"
                  value={form.totpToken}
                  onChangeText={(text) => onFormChange("totpToken", text)}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry
                  autoFocus={showTotpToken}
                  keyboardAppearance={theme.config.initialColorMode}
                />
              }
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
            />
          )}
        </Section>

        {/* { */}
        {/*    serverIndex && ( */}
        {/*        <Section */}
        {/*            header={"DELETE"} */}
        {/*            roundedCorners={true} */}
        {/*            hideSurroundingSeparators={true} */}
        {/*        > */}
        {/*            <CCell cellContentView={ */}
        {/*                <Button title={"Delete Server"} color={"red"} onPress={onDeletePress} /> */}
        {/*            } /> */}
        {/*        </Section> */}
        {/*    ) */}
        {/* } */}
      </TableView>
    </VStack>
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
