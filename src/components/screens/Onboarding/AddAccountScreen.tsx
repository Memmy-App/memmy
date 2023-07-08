import React, { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { Button, Pressable, Text, useTheme, VStack } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CTextInput from "../../common/CTextInput";
import {
  getInstanceError,
  login,
  lemmyAuthToken,
} from "../../../LemmyInstance";
import LoadingModal from "../../common/Loading/LoadingModal";
import { useAppDispatch } from "../../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { addAccount } from "../../../slices/accounts/accountsActions";
import { writeToLog } from "../../../helpers/LogHelper";
import { showToast } from "../../../slices/toast/toastSlice";
import ILemmyCredentials from "../../../types/lemmy/ILemmyCredentials";

const header = require("../../../../assets/header.jpg");

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function AddAccountScreen({ route, navigation }: IProps) {
  const [form, setForm] = useState<ILemmyCredentials>({
    server: "",
    username: "",
    password: "",
    totpToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [showTotpToken, setShowTotpToken] = useState(false);

  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (route.params && route.params.server) {
      onFormChange("server", route.params.server);
    }
  }, []);

  const onFormChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const doLogin = async () => {
    if (!form.server || !form.username || !form.password) {
      dispatch(
        showToast({
          message: "All fields are required",
          duration: 3000,
          variant: "warn",
        })
      );

      return;
    }

    setLoading(true);

    const regex = /^(?:https?:\/\/)?([^/]+)/;
    const serverParsed = form.server.match(regex)[1];

    const serverCreds: ILemmyCredentials = {
      username: form.username,
      password: form.password,
      server: serverParsed,
      totpToken: form.totpToken,
    };

    setLoading(true);

    const success = await login(serverCreds);

    setLoading(false);

    if (success) return;

    writeToLog("Error adding account.");

    const error = getInstanceError();

    if (error === "missing_totp_token") {
      setShowTotpToken(true);
      return;
    }

    Alert.alert("Error", getInstanceError());
  };

  const onPress = () => {
    if (form.username.includes("@")) {
      Alert.alert("Error", "Please use your username when signing in.");
      return;
    }

    doLogin().then(() => {
      if (!lemmyAuthToken) return;

      dispatch(
        addAccount({
          username: form.username,
          instance: getBaseUrl(form.server),
          token: lemmyAuthToken,
        })
      );

      setLoading(false);
    });
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.app.bg }}
      keyboardShouldPersistTaps="handled"
    >
      <LoadingModal loading={loading} />

      <VStack flex={1} mb={5} space="md" justifyContent="center">
        <VStack mx={3}>
          <Image
            source={header}
            style={{
              height: 175,
              width: "100%",
              borderBottomWidth: 1,
              borderColor: "white",
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
          <CTextInput
            name="server"
            value={form.server}
            placeholder="Server"
            label="Server"
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="web-search"
          />
          <CTextInput
            name="username"
            value={form.username}
            placeholder="Username"
            label="Username"
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CTextInput
            name="password"
            value={form.password}
            placeholder="Password"
            label="Password"
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
            secure
          />
          {showTotpToken && (
            <CTextInput
              name="totpToken"
              value={form.totpToken}
              placeholder="2FA Token"
              label="2FA Token"
              onChange={onFormChange}
              autoCapitalize="none"
              autoCorrect={false}
              secure
            />
          )}
          <Text justifyContent="center" alignItems="center">
            By using Memmy, you agree to the
            <Pressable
              onPress={() => navigation.push("Viewer", { type: "terms" })}
            >
              <Text mt={1.5} color={theme.colors.app.accent}>
                {" "}
                Terms of Use
              </Text>
            </Pressable>
          </Text>
          <Button
            size="sm"
            colorScheme="lightBlue"
            onPress={onPress}
            borderRadius="20"
            mt={3}
            mx={2}
          >
            <Text fontWeight="semibold" fontSize="lg">
              Login
            </Text>
          </Button>
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default AddAccountScreen;
