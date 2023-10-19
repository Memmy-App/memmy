import { useAppStore } from '@src/state';

export const setDrawerOpen = (open: boolean): void => {
  useAppStore.setState((state) => {
    state.drawerOpen = open;
  });
};
