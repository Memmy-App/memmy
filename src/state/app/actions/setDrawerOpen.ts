import { useAppStore } from '@src/state/app/appStore';

export const setDrawerOpen = (open: boolean): void => {
  useAppStore.setState((state) => {
    state.drawerOpen = open;
  });
};
