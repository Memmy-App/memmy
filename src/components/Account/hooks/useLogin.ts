import { useState } from 'react';
import instance from '@src/Instance';
import { EInitializeResult } from '@api/common/ApiInstance';
import { addAccount, setToast } from '@src/state';
import { Alert } from 'react-native';
import { useThemeColorScheme } from '@hooks/useThemeColorScheme';

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

    try {
      const res = await instance.initialize({
        type: 'lemmy',
        host: options.instance,
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

      addAccount({
        instance: options.instance,
        username: options.username,
        fullUsername: `${options.username}@${options.instance}`,
        token: instance.authToken ?? '',
        isCurrentAccount: true,
      });
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'An unknown error has occurred.');
    }
  };

  return { doLogin, loading };
};
