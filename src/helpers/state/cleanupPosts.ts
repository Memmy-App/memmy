import { removePost, useFeedStore } from '@src/state';

export const cleanupPosts = (screenId: string): void => {
  const postIds = useFeedStore.getState().feeds.get(screenId)?.postIds ?? [];

  for (let i = 0; i < postIds.length; i++) {
    const postId = postIds[i];

    removePost(postId, screenId);
  }

  useFeedStore.getState().feeds.delete(screenId);
};
