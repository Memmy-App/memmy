import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Account } from "../../../types/Account";

interface UseNotifications {
  loading: boolean;

  enable: (account: Account) => Promise<{ result: boolean; message: string }>;
  disable: (account: Account) => Promise<{ result: boolean; message: string }>;
}

const useNotifications = (): UseNotifications => {
  const [loading, setLoading] = useState(false);

  const register = async (): Promise<boolean | string> => {
    if (!Device.isDevice) {
      console.log("Not a real device.");
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Error",
        "Please allow Memmy to send you push notifications."
      );
      return false;
    }

    return (await Notifications.getDevicePushTokenAsync()).data;
  };

  const enable = async (
    account: Account
  ): Promise<{ result: boolean; message: string }> => {
    const token = await register();

    if (!token) {
      return {
        result: false,
        message: "Failed to retrieve token.",
      };
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", account.username);
    formData.append("instance", account.instance);
    formData.append("authToken", account.token);
    formData.append("pushToken", token as string);

    const res = await axios.post("https://memmy.app/api/push/enable", formData);

    setLoading(false);

    if (res.status !== 200) {
      return {
        result: false,
        message: "Failed to authenticate with Lemmy instance.",
      };
    }

    return {
      result: true,
      message: "Successfully enabled push notifications.",
    };
  };

  const disable = async (
    account: Account
  ): Promise<{ result: boolean; message: string }> => {
    const token = await register();

    if (!token) {
      return {
        result: false,
        message: "Failed to retrieve token.",
      };
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", account.username);
    formData.append("instance", account.instance);
    formData.append("authToken", account.token);
    formData.append("pushToken", token as string);

    const res = await axios.post(
      "https://memmy.app/api/push/disable",
      formData
    );

    setLoading(false);

    if (res.status !== 200) {
      return {
        result: false,
        message: "Failed to authenticate with Lemmy instance.",
      };
    }

    return {
      result: true,
      message: "Successfully disabled push notifications.",
    };
  };

  return {
    loading,
    enable,
    disable,
  };
};

export default useNotifications;
