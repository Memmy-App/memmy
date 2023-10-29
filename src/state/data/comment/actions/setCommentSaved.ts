import { useCommentStore } from '@src/state';

export const setCommentSaved = (commentId: number): void => {
  useCommentStore.setState((state) => {
    const comment = state.comments.get(commentId);

    if (comment == null) return;

    comment.view.saved = !comment.view.saved;
  });
};
