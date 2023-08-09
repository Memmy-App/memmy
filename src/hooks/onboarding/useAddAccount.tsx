import { useCallback, useEffect, useState } from "react";
import ILemmyServer from "@src/types/api/ILemmyServer";
import instance, { createInstance } from "@src/Instance";
import addAccount from "@src/state/account/actions/addAccount";
import getBaseUrl from "@src/helpers/links/getBaseUrl";
import ILoadingStatus from "@src/types/ILoadingStatus";
import { useShowToast } from "@src/state/toast/toastStore";
import { useRoute } from "@react-navigation/core";

interface UseAddAccount {
  status: ILoadingStatus;

  form: ILemmyServer;

  onChange: (key: string, value: string) => void;
  onLoginPress: () => void;
}

const useAddAccount = (): UseAddAccount => {
  const route = useRoute<any>();

  const [status, setStatus] = useState<ILoadingStatus>({
    loading: false,
    error: false,
  });

  const [form, setForm] = useState<ILemmyServer>({
    host: "",
    username: "",
    password: "",
    totpToken: "",
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

  const onLoginPress = useCallback(() => {
    setStatus({
      loading: true,
      error: false,
    });

    // Make sure necessary values are set
    if (!form.host || !form.username || !form.password) {
      // Display the toast
      showToast({
        message: "All fields are required",
        duration: 3000,
        variant: "warn",
      });
    }

    // Make sure username is not an email
    if (form.username.includes("@")) {
      showToast({
        message: "Please sign in with your username",
        duration: 3000,
        variant: "warn",
      });
    }

    // Make sure the server is a valid host

    // Attempt to sign in
    createInstance();
    try {
      instance?.initialize({
        type: "lemmy",
        host: form.host,
        username: form.username,
        password: form.password,
        totpToken: form.totpToken ?? undefined,
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

    form,
    onChange,
    onLoginPress,
  };
};

export default useAddAccount;
