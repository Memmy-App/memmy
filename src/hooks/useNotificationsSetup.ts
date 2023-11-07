import { useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { IAccount } from '@src/types';
import axios from 'axios';
import { getAccessToken } from '@helpers/secureStore';

const API_URL = __DEV__
  ? process.env.EXPO_PUBLIC_TEST_API
  : process.env.EXPO_PUBLIC_LIVE_API;

interface UseNotifications {
  isLoading: boolean;
  enableOrDisable: (
    account: IAccount,
    action: 'enable' | 'disable',
  ) => Promise<boolean>;
}

export const useNotificationsSetup = (): UseNotifications => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (): Promise<string | null> => {
    if (!Device.isDevice) return null;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Error',
        'Please grant Memmy access to send you push notifications.',
      );
      return null;
    }

    return (await Notifications.getDevicePushTokenAsync()).data;
  };

  const enableOrDisable = async (
    account: IAccount,
    action: 'enable' | 'disable',
  ): Promise<boolean> => {
    const token = await register();

    if (token == null) {
      return false;
    }

    setIsLoading(true);

    // Get the access token
    const accessToken = await getAccessToken(account);

    if (accessToken == null) {
      setIsLoading(false);
      return false;
    }

    try {
      const res = await axios.post(`${API_URL}/account/push/${action}`, {
        instance: account.instance,
        authToken: accessToken,
        pushToken: token,
      });

      setIsLoading(false);

      return res.status === 200;
    } catch (e: any) {
      setIsLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    enableOrDisable,
  };
};
