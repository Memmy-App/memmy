import { useState } from 'react';
import instance from '@src/Instance';
import { addAccount } from '@src/state';

interface DoLoginOptions {
  instance: string;
  username: string;
  password: string;
  captchaUuid?: string;
  captchaAnswer?: string;
  totpToken?: string;
}

interface LoginStatus {
  loading: boolean;
  error: boolean;
}

interface UseLogin {
  status: LoginStatus;
  doLogin: (options: DoLoginOptions) => Promise<void>;
}

export const useLogin = (): UseLogin => {
  const [status, setStatus] = useState({
    loading: false,
    error: false,
  });

  const doLogin = async (options: DoLoginOptions): Promise<void> => {
    setStatus({
      loading: true,
      error: false,
    });

    try {
      await instance.initialize({
        type: 'lemmy',
        host: options.instance,
        username: options.username,
        password: options.password,
        totpToken: options.totpToken,
      });

      addAccount({
        instance: options.instance,
        username: options.username,
        fullUsername: `${options.username}@${options.instance}`,
        token: instance.authToken ?? '',
        isCurrentAccount: true,
      });
    } catch (e) {
      setStatus({
        loading: false,
        error: true,
      });
    }
  };

  return { status, doLogin };
};
