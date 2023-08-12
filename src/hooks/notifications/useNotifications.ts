import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert } from "react-native";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import IAccount from "@src/types/IAccount";

interface UseNotifications {
  loading: boolean;

  enable: (account: IAccount) => Promise<{ result: boolean; message: string }>;
  disable: (account: IAccount) => Promise<{ result: boolean; message: string }>;
}

const useNotifications = (): UseNotifications => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const register = async (): Promise<boolean | string> => {
    if (!Device.isDevice) return false;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        t("alert.title.error"),
        t("alert.message.allowPushNotifications")
      );
      return false;
    }

    return (await Notifications.getDevicePushTokenAsync()).data;
  };

  const enable = async (
    account: IAccount
  ): Promise<{ result: boolean; message: string }> => {
    const token = await register();

    if (!token) {
      return {
        result: false,
        message: t("alert.message.failedToRetrieveToken"),
      };
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", account.username);
    formData.append("instance", account.host);
    formData.append("authToken", account.authToken);
    formData.append("pushToken", token as string);

    const res = await axios.post("https://memmy.app/api/push/enable", formData);

    setLoading(false);

    if (res.status !== 200) {
      return {
        result: false,
        message: t("alert.message.instanceAuthenticationFailed"),
      };
    }

    return {
      result: true,
      message: t("alert.message.pushNotificationsEnabled"),
    };
  };

  const disable = async (
    account: IAccount
  ): Promise<{ result: boolean; message: string }> => {
    const token = await register();

    if (!token) {
      return {
        result: false,
        message: t("alert.message.failedToRetrieveToken"),
      };
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", account.username);
    formData.append("instance", account.host);
    formData.append("authToken", account.authToken);
    formData.append("pushToken", token as string);

    const res = await axios.post(
      "https://memmy.app/api/push/disable",
      formData
    );

    setLoading(false);

    if (res.status !== 200) {
      return {
        result: false,
        message: t("alert.message.instanceAuthenticationFailed"),
      };
    }

    return {
      result: true,
      message: t("alert.message.pushNotificationsDisabled"),
    };
  };

  return {
    loading,
    enable,
    disable,
  };
};

export default useNotifications;
