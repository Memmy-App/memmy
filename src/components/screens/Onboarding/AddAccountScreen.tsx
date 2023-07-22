import React, { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { Button, Pressable, Text, useTheme, VStack } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Trans, useTranslation } from "react-i18next";
import CTextInput from "../../common/CTextInput";
import {
  getInstanceError,
  initialize,
  lemmyAuthToken,
} from "../../../LemmyInstance";
import LoadingModal from "../../common/Loading/LoadingModal";
import { useAppDispatch } from "../../../../store";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { addAccount } from "../../../slices/accounts/accountsActions";
import { writeToLog } from "../../../helpers/LogHelper";
import { showToast } from "../../../slices/toast/toastSlice";
import ILemmyServer from "../../../types/lemmy/ILemmyServer";

const header = require("../../../../assets/header.jpg");

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function AddAccountScreen({ route, navigation }: IProps) {
  const [form, setForm] = useState<ILemmyServer>({
    server: "",
    username: "",
    password: "",
    auth: "",
    totpToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [showTotpToken, setShowTotpToken] = useState(false);

  const { t } = useTranslation();
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
          message: t("toast.allFieldsRequired"),
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

    Alert.alert(t("alert.title.error"), getInstanceError());
  };

  const onPress = () => {
    if (form.username.includes("@")) {
      Alert.alert(t("alert.title.error"), t("alert.message.useUsername"));
      return;
    }

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
            placeholder={t("Server")}
            label={t("Server")}
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="web-search"
          />
          <CTextInput
            name="username"
            value={form.username}
            placeholder={t("Username")}
            label={t("Username")}
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CTextInput
            name="password"
            value={form.password}
            placeholder={t("Password")}
            label={t("Password")}
            onChange={onFormChange}
            autoCapitalize="none"
            autoCorrect={false}
            secure
          />
          {showTotpToken && (
            <CTextInput
              name="totpToken"
              value={form.totpToken}
              placeholder={t("2FA Token")}
              label={t("2FA Token")}
              onChange={onFormChange}
              autoCapitalize="none"
              autoCorrect={false}
              secure
            />
          )}
          <Text justifyContent="center" alignItems="center">
            <Trans
              i18nKey="onboarding.agreeToTermsOfUse"
              components={{
                linkAction: (
                  <Pressable
                    onPress={() => navigation.push("Viewer", { type: "terms" })}
                  />
                ),
                linkText: <Text mt={1.5} color={theme.colors.app.accent} />,
              }}
            />
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
              {t("Login")}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default AddAccountScreen;
