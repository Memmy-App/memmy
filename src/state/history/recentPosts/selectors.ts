import { PostView } from 'lemmy-js-client';
import { useHistoryStore, useAccountStore } from '@src/state';

export const useRecentPostHistory = (): PostView[] | undefined => {
  const currentAccount = useAccountStore.getState().currentAccount;

  return useHistoryStore((state) => {
    if (currentAccount == null || currentAccount.fullUsername.length === 0) {
      return;
    }

    if (!(currentAccount.fullUsername in state.userScoped)) {
      state.userScoped[currentAccount.fullUsername] = {
        recentPosts: [],
      };
    }

    return state.userScoped[currentAccount.fullUsername].recentPosts;
  });
};
