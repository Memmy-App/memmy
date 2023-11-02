import { useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { IAccount } from '@src/types';
import axios from 'axios';

const API_URL = __DEV__
  ? process.env.EXPO_PUBLIC_TEST_API
  : 'https://memmy.app/account/push';

interface UseNotifications {
  isLoading: boolean;
  enableOrDisable: (
    account: IAccount,
    action: 'enable' | 'disable',
  ) => Promise<boolean>;
}

export const useNotifications = (): UseNotifications => {
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

    try {
      const res = await axios.post(`${API_URL}/${action}`, {
        instance: account.instance,
        authToken: account.token,
        pushToken: token,
      });

      setIsLoading(false);

      if (res.status !== 200) return false;

      return true;
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
