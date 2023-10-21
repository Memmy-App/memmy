import React, { useEffect, useRef, useState } from 'react';
import { useCurrentAccount, useSiteStore } from '@src/state';
import { IAccount } from '@src/types';
import instance from '@src/Instance';
import { Alert } from 'react-native';
import MainFeed from '@components/Feed/components/MainFeed';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';

export default function FeedIndexScreen(): React.JSX.Element {
  const currentAccount = useCurrentAccount();
  const previousAccount = useRef<IAccount | null>(null);
  const [initialized, setInitialized] = useState(false);
  const setSite = useSiteStore((state) => state.setSite);

  // On current account changes
  useEffect(() => {
    // Return if the account hasn't changed
    if (currentAccount === previousAccount.current) return;
    // Make sure it is not null
    if (currentAccount == null) return;

    previousAccount.current = currentAccount;

    // Reset the instance
    setInitialized(false);
    instance.resetInstance();

    // Initialize
    void instance
      .initialize({
        host: currentAccount.instance,
        authToken: currentAccount.token,
        username: currentAccount.username,
        type: 'lemmy',
      })
      .then(() => {
        // For now we will chain our initial requests here
        void instance
          .getSite()
          .then((site) => {
            // @ts-expect-error TODO fix this
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
  }, [currentAccount]);

  if (!initialized) return <LoadingScreen />;

  return <MainFeed />;
}
