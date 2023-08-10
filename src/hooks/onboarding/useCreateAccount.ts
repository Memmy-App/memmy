import { useCallback, useEffect, useState } from "react";
import instance from "@src/Instance";
import ILoadingStatus from "@src/types/ILoadingStatus";
import { useShowToast } from "@src/state/toast/toastStore";
import { useRoute } from "@react-navigation/core";
import { Alert } from "react-native";
import { EInitializeResult } from "@src/api/common/ApiInstance";
import { useTranslation } from "react-i18next";
import { addAccount } from "@src/state/account/actions";
import { getBaseUrl } from "@src/helpers/links";

interface UseCreateAccount {
  status: ILoadingStatus;
  showCaptcha: boolean;
  png?: string;
  sentEmail: boolean;

  form: CreateAccountForm;

  onChange: (key: string, value: string) => void;
  onSignupPress: () => Promise<void>;
  onLoginPress: () => Promise<void>;
}

export interface CreateAccountForm {
  host: string;
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
  showNsfw: boolean;
  captchaUuid?: undefined;
  captchaAnswer?: undefined;
}

const useCreateAccount = (): UseCreateAccount => {
  const route = useRoute<any>();
  const { t } = useTranslation();

  const [status, setStatus] = useState<ILoadingStatus>({
    loading: false,
    error: false,
  });
  const [sentEmail, setSentEmail] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [png, setPng] = useState<string | undefined>(undefined);

  const [form, setForm] = useState<CreateAccountForm>({
    host: "",
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    showNsfw: false,
    captchaUuid: undefined,
    captchaAnswer: undefined,
  });

  const showToast = useShowToast();

  useEffect(() => {
    if (route.params?.host) onChange("host", route.params.host);
  }, []);

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSignupPress = useCallback(async () => {
    // Make sure necessary values are set
    if (!form.host || !form.username || !form.password || !form.passwordAgain) {
      // Display the toast
      showToast({
        message: t("toast.allFieldsRequired"),
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    // Make sure username is not an email
    if (!form.email.includes("@")) {
      showToast({
        message: t("toast.email"),
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    if (form.password !== form.passwordAgain) {
      showToast({
        message: t("toast.passwordsMismatch"),
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    // Make sure the server is a valid host

    setStatus({
      loading: true,
      error: false,
    });

    // Attempt to register
    try {
      const res = await instance?.initialize(
        {
          type: "lemmy",
          host: form.host,
          username: form.username,
          password: form.password,
        },
        true,
        {
          email: form.email,
          showNsfw: form.showNsfw,
          captchaAnswer: form.captchaAnswer,
          captchaUuid: form.captchaUuid,
        }
      );

      if (res === EInitializeResult.CAPTCHA) {
        // Load captcha
        loadCaptcha().then();

        setStatus({
          loading: false,
          error: false,
        });
        return;
      }

      setStatus({
        loading: false,
        error: false,
      });

      if (res === EInitializeResult.VERIFY_EMAIL) {
        setSentEmail(true);
        return;
      }

      addAccount({
        host: form.host,
        username: form.username,
        fullUsername: `${form.username}@${getBaseUrl(form.host)}`,
        authToken: instance!.authToken,
        isCurrentAccount: true,
      });
    } catch (e) {
      setStatus({
        loading: false,
        error: true,
      });
    }
  }, [form]);

  const loadCaptcha = async () => {
    try {
      const res = await instance.getCaptcha();

      setPng(res?.ok?.png);
      onChange("captchaUuid", res!.ok!.uuid);
      setShowCaptcha(true);
    } catch (e) {
      Alert.alert("Error", "Error fetching captcha for registration.");
    }
  };

  const onLoginPress = useCallback(async () => {
    // Make sure necessary values are set
    if (!form.host || !form.username || !form.password) {
      // Display the toast
      showToast({
        message: "All fields are required",
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    // Make sure username is not an email
    if (form.username.includes("@")) {
      showToast({
        message: "Please sign in with your username",
        duration: 3000,
        variant: "warn",
      });
      return;
    }

    // Make sure the server is a valid host

    setStatus({
      loading: true,
      error: false,
    });

    // Attempt to sign in
    // createInstance();
    try {
      if (!instance) Alert.alert("No instance");

      await instance?.initialize({
        type: "lemmy",
        host: form.host,
        username: form.username,
        password: form.password,
      });

      addAccount({
        host: form.host,
        username: form.username,
        fullUsername: `${form.username}@${getBaseUrl(form.host)}`,
        authToken: instance!.authToken,
        isCurrentAccount: true,
      });

      setStatus({
        loading: false,
        error: false,
      });
    } catch (e) {
      /** Handled */

      setStatus({
        loading: false,
        error: true,
      });
    }
  }, [form]);

  return {
    status,
    showCaptcha,
    png,
    sentEmail,

    form,
    onChange,
    onSignupPress,
    onLoginPress,
  };
};

export default useCreateAccount;
