import { useAppStore } from '@src/state';

export const setUnread = (count: number | boolean): void => {
  useAppStore.setState((state) => {
    if (typeof count === 'boolean') {
      state.unread = state.unread - 1;
      return;
    }

    state.unread = count;
  });
};
