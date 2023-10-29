import { useCommentStore } from '@src/state';
import { CommentView } from 'lemmy-js-client';

export const updateComment = (comment: CommentView): void => {
  useCommentStore.setState((state) => {
    const current = state.comments.get(comment.comment.id);

    if (current == null) return;

    current.view.comment.content = comment.comment.content;
    current.view.comment.removed = comment.comment.removed;
    current.view.comment.deleted = comment.comment.deleted;
  });
};
