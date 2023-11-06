import { useState } from 'react';
import instance from '@src/Instance';
import { EInitializeResult } from '@api/common/ApiInstance';
import { addAccount, setToast } from '@src/state';
import { Alert } from 'react-native';
import { getBaseUrl } from '@helpers/links';

const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

interface DoSignupOptions {
  instance: string;
  email: string;
  username: string;
  password: string;
  passwordAgain: string;
  captchaUuid?: string;
  captchaAnswer?: string;
}

export interface UseSignup {
  loading: boolean;
  doSignup: (options: DoSignupOptions) => Promise<void>;
  captchaUuid: string | null;
  captchaPng: string | null;
  emailVerification: boolean;
}

export const useSignup = (): UseSignup => {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [captchaUuid, setCaptchaUuid] = useState<string | null>(null);
  const [captchaPng, setCaptchaPng] = useState<string | null>(null);

  const doSignup = async (options: DoSignupOptions): Promise<void> => {
    try {
      if (options.password !== options.passwordAgain) {
        setToast({
          text: 'Passwords do not match.',
        });
        return;
      }

      if (!validateEmail(options.email)) {
        setToast({
          text: 'Email is invalid.',
        });
        return;
      }

      if (
        options.instance === '' ||
        options.username === '' ||
        options.password === '' ||
        options.passwordAgain === ''
      ) {
        setToast({
          text: 'Please fill out all fields.',
        });
        return;
      }

      if (options.username.includes('@')) {
        setToast({
          text: 'Please enter a username instead of an email.',
        });
        return;
      }

      setLoading(true);

      const res = await instance.initialize(
        {
          type: 'lemmy',
          host: getBaseUrl(options.instance),
          username: options.username,
          password: options.password,
        },
        !emailVerification,
        !emailVerification
          ? {
              email: options.email,
              showNsfw: false,
              captchaUuid: options.captchaUuid,
              captchaAnswer: options.captchaAnswer,
            }
          : undefined,
      );

      switch (res) {
        case EInitializeResult.CAPTCHA: {
          const res = await instance.getCaptcha();

          if (res?.ok == null) {
            Alert.alert('Error', 'Failed to obtain captcha.');
            setLoading(false);
            return;
          }

          setCaptchaUuid(res.ok.uuid);
          setCaptchaPng(res.ok.png);

          setToast({
            text: 'Please enter the captcha below.',
          });

          setLoading(false);
          return;
        }
        case EInitializeResult.VERIFY_EMAIL: {
          setLoading(false);
          setEmailVerification(true);
          return;
        }
        default: {
          setLoading(false);
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
        notificationsEnabled: false,
      });
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'An unknown error has occurred.');
    }
  };

  return {
    loading,
    doSignup,
    captchaUuid,
    captchaPng,
    emailVerification,
  };
};
