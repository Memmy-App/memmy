import { useDataStore } from '@src/state';

export const addSavedPosts = (posts: number[], refresh = false): void => {
  useDataStore.setState((state) => {
    if (refresh) {
      state.savedPosts = posts;
    } else {
      state.savedPosts = [...state.savedPosts, ...posts];
    }
  });
};
