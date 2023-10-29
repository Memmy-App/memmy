import { useDataStore } from '@src/state';

interface SetPostSavedParams {
  postId: number;
}

export const setPostSaved = ({ postId }: SetPostSavedParams): void => {
  useDataStore.setState((state) => {
    const post = state.posts.get(postId);

    if (post == null) return;

    post.view.saved = !post.view.saved;
  });
};
