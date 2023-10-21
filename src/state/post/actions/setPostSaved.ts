import { usePostStore } from '@src/state';

export const setPostSaved = (postId: number): void => {
  usePostStore.setState((state) => {
    const post = state.posts.get(postId);

    if (post == null) return;

    post.view.saved = !post.view.saved;
  });
};
