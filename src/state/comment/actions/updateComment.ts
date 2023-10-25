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

export const updateCommentContent = (
  commentId: number,
  content: string,
): void => {
  useCommentStore.setState((state) => {
    const current = state.comments.get(commentId);

    if (current == null) return;

    current.view.comment.content = content;
  });
};
