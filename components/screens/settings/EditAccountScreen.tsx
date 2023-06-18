import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { useTheme, useToast, VStack } from "native-base";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import { initialize, lemmyAuthToken } from "../../../lemmy/LemmyInstance";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectAccounts } from "../../../slices/accounts/accountsSlice";
import {
  addAccount,
  editAccount,
} from "../../../slices/accounts/accountsActions";

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

    try {
      setLoading(true);

      await initialize(form);
    } catch (e) {
      setLoading(false);

      if (e === "missing_totp_token") {
        setShowTotpToken(true);
      } else {
        Alert.alert("Error authenticating with server.");
      }

      return;
    }

    if (!lemmyAuthToken) {
      setLoading(false);
      Alert.alert("Error authenticating with server.");
      return;
    }

    if (edit) {
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
    <VStack flex={1} backgroundColor="screen.800">
      <TableView style={styles.table}>
        <Section
          header="SERVER ADDRESS"
          roundedCorners
          hideSurroundingSeparators
          footer="URL for the server you wish to connect"
        >
          <Cell
            cellContentView={
              <TextInput
                style={{ fontSize: 16, flex: 1, color: theme.colors.gray[400] }}
                placeholderTextColor={theme.colors.screen["400"]}
                placeholder="Server Address"
                value={form.server}
                onChangeText={(text) => onFormChange("server", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
              />
            }
            backgroundColor={theme.colors.screen["700"]}
            titleTextColor={theme.colors.lightText}
            rightDetailColor={theme.colors.screen["400"]}
          />
        </Section>

        <Section
          header="SERVER CREDENTIALS"
          roundedCorners
          hideSurroundingSeparators
          footer="Credentials for the server you are connecting."
        >
          <Cell
            cellContentView={
              <TextInput
                style={{ fontSize: 16, flex: 1, color: theme.colors.gray[400] }}
                placeholderTextColor={theme.colors.screen["400"]}
                placeholder="Username"
                value={form.username}
                onChangeText={(text) => onFormChange("username", text)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
              />
            }
            backgroundColor={theme.colors.screen["700"]}
            titleTextColor={theme.colors.lightText}
            rightDetailColor={theme.colors.screen["400"]}
          />
          <Cell
            cellContentView={
              <TextInput
                style={{ fontSize: 16, flex: 1, color: theme.colors.lightText }}
                placeholderTextColor={theme.colors.screen["400"]}
                placeholder="Password"
                value={form.password}
                onChangeText={(text) => onFormChange("password", text)}
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry
              />
            }
            backgroundColor={theme.colors.screen["700"]}
            titleTextColor={theme.colors.lightText}
            rightDetailColor={theme.colors.screen["400"]}
          />
          {showTotpToken && (
            <Cell
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.lightText,
                  }}
                  placeholderTextColor={theme.colors.screen["400"]}
                  placeholder="2FA Token"
                  value={form.totpToken}
                  onChangeText={(text) => onFormChange("totpToken", text)}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry
                  autoFocus={showTotpToken}
                />
              }
              backgroundColor={theme.colors.screen["700"]}
              titleTextColor={theme.colors.lightText}
              rightDetailColor={theme.colors.screen["400"]}
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
        {/*            <Cell cellContentView={ */}
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
