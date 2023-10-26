import { useAppStore } from '@src/state';

export const setAppLoading = (v: boolean): void => {
  useAppStore.setState((state) => {
    state.isLoading = v;
  });
};
