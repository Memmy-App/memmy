import { removePost, useDataStore } from '@src/state';

export const cleanupPosts = (screenId: string): void => {
  const postIds = useDataStore.getState().feeds.get(screenId)?.postIds ?? [];

  for (let i = 0; i < postIds.length; i++) {
    const postId = postIds[i];

    removePost({
      postId,
      screenIdOrOverride: screenId,
    });
  }

  useDataStore.setState((state) => {
    state.feeds.delete(screenId);
  });
};
