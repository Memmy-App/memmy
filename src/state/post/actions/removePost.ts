import { usePostStore } from '@src/state/post/postStore';

export const removePost = (
  postId: number,
  screenIdOrOverride: string | boolean,
): void => {
  if (typeof screenIdOrOverride === 'boolean' && screenIdOrOverride) {
    usePostStore.setState((state) => {
      state.posts.delete(postId);
    });

    return;
  }

  usePostStore.setState((state) => {
    const post = state.posts.get(postId);

    if (post == null) return;

    post.usedBy = post.usedBy.filter(
      (screenId) => screenId !== screenIdOrOverride,
    );

    if (post.usedBy.length < 1) {
      state.posts.delete(postId);
    }
  });
};
