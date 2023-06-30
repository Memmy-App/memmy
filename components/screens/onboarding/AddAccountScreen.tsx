import React, { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { Button, Text, useTheme, VStack } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CTextInput from "../../ui/CTextInput";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {
  getInstanceError,
  initialize,
  lemmyAuthToken,
} from "../../../lemmy/LemmyInstance";
import LoadingModal from "../../ui/Loading/LoadingModal";
import { useAppDispatch } from "../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { addAccount } from "../../../slices/accounts/accountsActions";
import { writeToLog } from "../../../helpers/LogHelper";
import { showToast } from "../../../slices/toast/toastSlice";

const header = require("../../../assets/header.jpg");

interface IProps {
  route: any;
}

function AddAccountScreen({ route }: IProps) {
  const [form, setForm] = useState<ILemmyServer>({
    server: "",
    username: "",
    password: "",
    auth: "",
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

    const server: ILemmyServer = {
      username: form.username,
      password: form.password,
      server: serverParsed,
      totpToken: form.totpToken,
    };

    setLoading(true);

    const success = await initialize(server);

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
    doLogin().then(() => {
      if (!lemmyAuthToken) return;

      dispatch(
        addAccount({
          username: form.username,
          password: form.password,
          instance: getBaseUrl(form.server),
          token: lemmyAuthToken,
        })
      );

      setLoading(false);
    });
  };

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.app.bg }}>
      <LoadingModal loading={loading} />

      <VStack flex={1} mb={5} space="md" justifyContent="center">
        <VStack mx={3}>
          <Image
            source={header}
            style={{
              height: 175,
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
            autoFocus={!route.params || !route.params.server}
          />
          <CTextInput
            name="username"
            value={form.username}
            placeholder="Username"
            label="Username"
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={route.params && route.params.server}
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
              autoFocus={showTotpToken}
              secure
            />
          )}
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
