import { useAppStore } from '@src/state';

export const setHomePress = (): void => {
  useAppStore.setState((state) => {
    state.lastFeedPress = Date.now();
  });
};
