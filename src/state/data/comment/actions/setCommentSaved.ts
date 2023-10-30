import { useDataStore } from '@src/state';

interface SetCommentSavedParams {
  commentId: number;
}

export const setCommentSaved = ({ commentId }: SetCommentSavedParams): void => {
  useDataStore.setState((state) => {
    const comment = state.comments.get(commentId);

    if (comment == null) return;

    comment.view.saved = !comment.view.saved;
  });
};
