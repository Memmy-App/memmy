import { useAppStore } from '@src/state';

export const setUnread = (count: number): void => {
  useAppStore.setState((state) => {
    state.unread = count;
  });
};
