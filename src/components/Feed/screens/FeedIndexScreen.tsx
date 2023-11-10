import React, { useEffect, useRef, useState } from 'react';
import { setSite, useCurrentAccount } from '@src/state';
import { IAccount } from '@src/types';
import instance from '@src/Instance';
import { Alert } from 'react-native';
import MainFeed from '@components/Feed/components/MainFeed';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import { getAccessToken, setAccessToken } from '@helpers/secureStore';
import { removeAccessTokenFromDataStore } from '@src/state/account/actions/removeAccessToken';

export default function FeedIndexScreen(): React.JSX.Element {
  const currentAccount = useCurrentAccount();
  const previousAccount = useRef<IAccount | null>(null);
  const [initialized, setInitialized] = useState(false);

  // On current account changes
  useEffect(() => {
    void initialize();
  }, [currentAccount]);

  const initialize = async (): Promise<void> => {
    // Return if the account hasn't changed
    if (currentAccount === previousAccount.current) return;
    // Make sure it is not null
    if (currentAccount == null) return;

    previousAccount.current = currentAccount;

    // We are going to migrate to using secure store. Will be removed in the future. For now, we want to see if the
    // user's token is inside the store. If not, we will set it then remove it from the account object.

    let token: string | null | undefined = await getAccessToken(currentAccount);

    if (token == null && currentAccount.token != null) {
      token = currentAccount.token;
      await setAccessToken(currentAccount, token);
      removeAccessTokenFromDataStore(currentAccount);
    }
    // Reset the instance
    setInitialized(false);
    instance.resetInstance();

    // Initialize
    void instance
      .initialize({
        host: currentAccount.instance,
        authToken: token!,
        username: currentAccount.username,
        type: 'lemmy',
      })
      .then(() => {
        // For now we will chain our initial requests here
        void instance
          .getSite()
          .then((site) => {
            setSite(site);
          })
          .then(() => {})
          .then(() => {
            void instance.getSubscriptions();
            void instance.getUnreadCount();
            setInitialized(true);
          });
      })
      .catch(() => {
        Alert.alert('Error initializing.');
      });
  };

  if (!initialized) return <LoadingScreen />;

  return <MainFeed />;
}
