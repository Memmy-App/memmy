import { useFeedStore } from '@src/state/feed/feedStore';
import { removePost } from '@src/state/post/actions';

export const cleanupPosts = (screenId: string): void => {
  const postIds = useFeedStore.getState().feeds.get(screenId)?.postIds ?? [];

  for (let i = 0; i < postIds.length; i++) {
    const postId = postIds[i];

    removePost(postId, screenId);
  }

  useFeedStore.getState().feeds.delete(screenId);
};
