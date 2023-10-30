import { removePost, useDataStore } from '@src/state';

export const cleanupPosts = (screenId: string): void => {
  useDataStore.setState((state) => {
    const postIds = state.feeds.get(screenId)?.postIds ?? [];

    for (let i = 0; i < postIds.length; i++) {
      const postId = postIds[i];

      removePost({
        postId,
        screenIdOrOverride: screenId,
      });
    }

    state.feeds.delete(screenId);
  });
};
