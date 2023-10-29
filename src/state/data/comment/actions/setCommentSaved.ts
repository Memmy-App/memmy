import { useDataStore } from '@src/state';

export const setCommentSaved = (commentId: number): void => {
  useDataStore.setState((state) => {
    const comment = state.comments.get(commentId);

    if (comment == null) return;

    comment.view.saved = !comment.view.saved;
  });
};
