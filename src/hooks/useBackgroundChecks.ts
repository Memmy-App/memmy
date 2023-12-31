import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import instance from '@src/Instance';

const updateCounts = async (): Promise<void> => {
  if (!instance.initialized) return;

  try {
    await instance.getUnreadCount();
  } catch (e) {}
};

let refreshInterval: NodeJS.Timeout | undefined;

const pattern = /inactive|background/;

export const useBackgroundChecks = (): void => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    refreshInterval = setInterval(() => {
      void updateCounts();
    }, 45000);

    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (
          pattern.test(appState.current) &&
          nextAppState === 'active' &&
          refreshInterval == null
        ) {
          refreshInterval = setInterval(() => {
            void updateCounts();
          }, 45000);
        } else if (
          appState.current === 'active' &&
          pattern.test(nextAppState)
        ) {
          clearInterval(refreshInterval);
          refreshInterval = undefined;
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      appStateListener?.remove();
      clearInterval(refreshInterval);
      refreshInterval = undefined;
    };
  }, []);
};
