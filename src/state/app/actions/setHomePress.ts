import { useAppStore } from '@src/state/app/appStore';

export const setHomePress = (): void => {
  useAppStore.setState((state) => {
    state.lastFeedPress = Date.now();
  });
};
