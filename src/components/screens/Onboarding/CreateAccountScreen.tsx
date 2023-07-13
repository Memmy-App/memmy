import { LemmyHttp } from "lemmy-js-client";
import { Button, Text, VStack, useTheme, Pressable } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Trans, useTranslation } from "react-i18next";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { writeToLog } from "../../../helpers/LogHelper";
import { initialize, lemmyAuthToken } from "../../../LemmyInstance";
import { addAccount } from "../../../slices/accounts/accountsActions";
import { useAppDispatch } from "../../../../store";
import CTextInput from "../../common/CTextInput";
import LoadingModal from "../../common/Loading/LoadingModal";
import { showToast } from "../../../slices/toast/toastSlice";
import ILemmyServer from "../../../types/lemmy/ILemmyServer";

const header = require("../../../../assets/header.jpg");

interface RegisterForm {
  server: string;
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  showNsfw: boolean;
  captchaUuid: string | undefined;
  captchaAnswer: string | undefined;
}

function CreateAccountScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [form, setForm] = useState<RegisterForm>({
    server: "",
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    showNsfw: false,
    captchaUuid: undefined,
    captchaAnswer: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  const [ready, setReady] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [png, setPng] = useState(undefined);

  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (route.params && route.params.server) {
      onFormChange("server", route.params.server);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    onReady().then();
  }, [ready]);

  const onFormChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onPress = async () => {
    if (
      !form.server ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.passwordAgain
    ) {
      dispatch(
        showToast({
          message: t("toast.allFieldsRequired"),
          duration: 3000,
          variant: "warn",
        })
      );

      return;
    }

    if (form.password !== form.passwordAgain) {
      dispatch(
        showToast({
          message: t("toast.passwordsMismatch"),
          duration: 3000,
          variant: "warn",
        })
      );

      return;
    }

    setLoading(true);

    const regex = /^(?:https?:\/\/)?([^/]+)/;
    const serverParsed = form.server.match(regex)[1];

    try {
      const tempInstance = new LemmyHttp(`https://${serverParsed}`);
      const res = await tempInstance.register({
        username: form.username,
        password: form.password,
        password_verify: form.passwordAgain,
        email: form.email,
        show_nsfw: true,
        captcha_uuid: form.captchaUuid,
        captcha_answer: form.captchaAnswer,
      });

      setLoading(false);

      if (!res.registration_created && !res.verify_email_sent) {
        Alert.alert(
          t("alert.title.error"),
          t("alert.message.registrationError")
        );
      } else if (res.verify_email_sent) {
        setSentEmail(true);
      } else {
        setReady(true);
      }
    } catch (e) {
      writeToLog("Error creating account.");
      writeToLog(e.toString());

      if (e.toString() === "captcha_incorrect") {
        loadCaptcha();
      } else {
        Alert.alert("Error", e.toString());
        setLoading(false);
      }
    }
  };

  const loadCaptcha = async () => {
    try {
      const tempInstance = new LemmyHttp(`https://${getBaseUrl(form.server)}`);

      const res = await tempInstance.getCaptcha({});

      setPng(res.ok.png);
      onFormChange("captchaUuid", res.ok.uuid);
      setShowCaptcha(true);
      setLoading(false);
    } catch (e) {
      writeToLog("Error getting captcha.");
      writeToLog(e.toString());
    }
  };

  const onReady = async () => {
    setLoading(true);

    const regex = /^(?:https?:\/\/)?([^/]+)/;
    const serverParsed = form.server.match(regex)[1];

    const server: ILemmyServer = {
      username: form.username,
      password: form.password,
      server: serverParsed,
    };

    try {
      await initialize(server);
    } catch (e) {
      writeToLog("Error initializing server.");
      writeToLog(e.toString());

      Alert.alert("Error", e.toString());
      setLoading(false);
      return;
    }

    server.auth = lemmyAuthToken;

    setLoading(false);

    dispatch(
      addAccount({
        username: form.username,
        password: form.password,
        instance: serverParsed,
        token: lemmyAuthToken,
      })
    );
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.app.bg }}
      keyboardShouldPersistTaps="handled"
    >
      <LoadingModal loading={loading} />
      <VStack flex={1} mb={5} space="md" justifyContent="center">
        <Image
          source={header}
          style={{
            height: 175,
            width: "100%",
            borderBottomWidth: 1,
            borderColor: "white",
          }}
          resizeMode="cover"
        />
        <VStack mx={3}>
          {sentEmail ? (
            <VStack px={4} space="md">
              <Text fontSize={32} textAlign="center">
                {t("onboarding.checkEmail")}
              </Text>
              <Text fontSize={18} textAlign="center">
                {t("onboarding.emailSent", [form.email])}
              </Text>
              <Button
                variant="outline"
                onPress={() => Linking.openURL("message://")}
                disabled={loading}
              >
                {t("onboarding.openEmailAppBtn")}
                Open Email App
              </Button>
              <Button onPress={() => setReady(true)} disabled={loading}>
                {t("onboarding.getStartedBtn")}
              </Button>
            </VStack>
          ) : (
            <>
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
                name="email"
                value={form.email}
                placeholder={t("Email")}
                label={t("Email")}
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
              <CTextInput
                name="passwordAgain"
                value={form.passwordAgain}
                placeholder={t("Confirm Password")}
                label={t("Confirm Password")}
                onChange={onFormChange}
                autoCapitalize="none"
                autoCorrect={false}
                secure
              />
              {showCaptcha && (
                <>
                  <Image
                    source={{ uri: `data:image/png;base64,${png}` }}
                    style={{ height: 100 }}
                    resizeMode="contain"
                  />
                  <CTextInput
                    name="captchaAnswer"
                    value={form.captchaAnswer}
                    placeholder={t("Captcha Answer")}
                    label={t("Captcha Answer")}
                    onChange={onFormChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </>
              )}
              <Text justifyContent="center" alignItems="center">
                <Trans
                  i18nKey="onboarding.agreeToTermsOfUse"
                  components={{
                    linkAction: (
                      <Pressable
                        onPress={() =>
                          navigation.push("Viewer", { type: "terms" })
                        }
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
                  {t("Create Account")}
                </Text>
              </Button>
            </>
          )}
        </VStack>
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default CreateAccountScreen;
