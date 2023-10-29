import { useDataStore } from '@src/state';

interface RemovePostParams {
  postId: number;
  screenIdOrOverride: string | boolean;
}

export const removePost = ({
  postId,
  screenIdOrOverride,
}: RemovePostParams): void => {
  useDataStore.setState((state) => {
    if (typeof screenIdOrOverride === 'boolean') {
      state.posts.delete(postId);
    }

    const post = state.posts.get(postId);
    if (post == null) return;

    // Update the used by array
    post.usedBy = post.usedBy.filter(
      (screenId) => screenId !== screenIdOrOverride,
    );

    if (post.usedBy.length < 1) {
      const postComments = state.postComments.get(postId);

      if (postComments != null) {
        for (let i = 0; i < postComments.length; i++) {
          state.comments.delete(postComments[i]);
        }

        state.postComments.delete(postId);
      }

      state.posts.delete(postId);
    }
  });
};
