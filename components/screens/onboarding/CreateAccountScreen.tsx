import { LemmyHttp } from "lemmy-js-client";
import { Button, Text, VStack, useTheme } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { writeToLog } from "../../../helpers/LogHelper";
import { initialize, lemmyAuthToken } from "../../../lemmy/LemmyInstance";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import { addAccount } from "../../../slices/accounts/accountsActions";
import { useAppDispatch } from "../../../store";
import CTextInput from "../../ui/CTextInput";
import LoadingModal from "../../ui/Loading/LoadingModal";
import { showToast } from "../../../slices/toast/toastSlice";

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

function CreateAccountScreen() {
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

  const theme = useTheme();
  const dispatch = useAppDispatch();

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
          message: "All fields are required.",
          duration: 3000,
          variant: "warn",
        })
      );

      return;
    }

    if (form.password !== form.passwordAgain) {
      dispatch(
        showToast({
          message: "Passwords do not match.",
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
          "Error",
          "An error occurred while completing registration."
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
    } catch (e) {}
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
    <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.app.bg }}>
      <LoadingModal loading={loading} />
      <VStack flex={1} pt={10} mb={5} space="md" justifyContent="center">
        {sentEmail ? (
          <VStack px={4} space="md">
            <Text fontSize={32} textAlign="center">
              Check Your Email
            </Text>
            <Text fontSize={18} textAlign="center">
              An email was sent to {form.email}. Please verify your account then
              press log in.
            </Text>
            <Button
              variant="outline"
              onPress={() => Linking.openURL("message://")}
              disabled={loading}
            >
              Open Email App
            </Button>
            <Button onPress={() => setReady(true)} disabled={loading}>
              Log In Now
            </Button>
          </VStack>
        ) : (
          <>
            <Text fontSize={32} textAlign="center">
              Create Account
            </Text>
            <CTextInput
              name="server"
              value={form.server}
              placeholder="Server"
              label="Server"
              onChange={onFormChange}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
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
              name="email"
              value={form.email}
              placeholder="Email"
              label="Email"
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
            <CTextInput
              name="passwordAgain"
              value={form.passwordAgain}
              placeholder="Confirm Password"
              label="Confirm Password"
              onChange={onFormChange}
              autoCapitalize="none"
              autoCorrect={false}
              secure
            />
            {/* <HStack mx={3}> */}
            {/*  <Text alignSelf="center">Show NSFW</Text> */}
            {/*  <Switch */}
            {/*    ml="auto" */}
            {/*    alignSelf="flex-end" */}
            {/*    value={form.showNsfw} */}
            {/*    onValueChange={onSwitchChange} */}
            {/*  /> */}
            {/* </HStack> */}
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
                  placeholder="Captcah Answer"
                  label="Captcha Answer"
                  onChange={onFormChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </>
            )}
            <Button mx={2} disabled={loading} onPress={onPress}>
              Add Account
            </Button>
          </>
        )}
      </VStack>
    </KeyboardAwareScrollView>
  );
}

export default CreateAccountScreen;
