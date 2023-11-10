import { useState } from 'react';
import instance from '@src/Instance';
import { EInitializeResult } from '@api/common/ApiInstance';
import { addAccount, setToast } from '@src/state';
import { Alert } from 'react-native';
import { useThemeColorScheme } from '@hooks/useThemeColorScheme';
import { getBaseUrl } from '@helpers/links';
import { IAccount } from '@src/types';
import { setAccessToken } from '@helpers/secureStore';

interface DoLoginOptions {
  instance: string;
  username: string;
  password: string;
  captchaUuid?: string;
  captchaAnswer?: string;
  totpToken?: string;
}

interface UseLogin {
  loading: boolean;
  doLogin: (options: DoLoginOptions) => Promise<void>;
}

export const useLogin = (): UseLogin => {
  const [loading, setLoading] = useState<boolean>(false);

  const colorScheme = useThemeColorScheme();

  const doLogin = async (options: DoLoginOptions): Promise<void> => {
    setLoading(true);

    // We actually want to check for any nullish values here.
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!options.instance || !options.username || !options.password) {
      setLoading(false);
      setToast({
        text: 'Please fill out all fields.',
      });
      return;
    }

    if (options.username.includes('@')) {
      setLoading(false);
      setToast({
        text: 'Please enter a username instead of an email.',
      });
      return;
    }

    try {
      const res = await instance.initialize({
        type: 'lemmy',
        host: getBaseUrl(options.instance),
        username: options.username,
        password: options.password,
        totpToken: options.totpToken,
      });

      setLoading(false);

      switch (res) {
        case EInitializeResult.PASSWORD: {
          setToast({
            text: 'Invalid password. Please try again.',
          });
          return;
        }
        case EInitializeResult.TOTP: {
          Alert.prompt(
            'One-Time Password',
            'Please enter your one-time password to authenticate with Lemmy.',
            (t) => {
              void doLogin({ ...options, totpToken: t });
            },
            'plain-text',
            undefined,
            'numeric',
            {
              cancelable: true,
              userInterfaceStyle: colorScheme,
            },
          );
          return;
        }
      }

      if (res !== EInitializeResult.SUCCESS) {
        Alert.alert('Error', 'An unknown error has occurred.');
        return;
      }

      const account: IAccount = {
        instance: options.instance,
        username: options.username,
        fullUsername: `${options.username}@${options.instance}`,
        isCurrentAccount: true,
        notificationsEnabled: false,
      };

      await setAccessToken(account, instance.authToken!);
      addAccount(account);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'An unknown error has occurred.');
    }
  };

  return { doLogin, loading };
};
