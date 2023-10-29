import { useCommentStore, usePostStore } from '@src/state';

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
      useCommentStore.setState((state) => {
        const postComments = state.postComments.get(postId);

        if (postComments != null) {
          for (let i = 0; i < postComments.length; i++) {
            state.comments.delete(postComments[i]);
          }

          state.postComments.delete(postId);
        }
      });

      state.posts.delete(postId);
    }
  });
};
