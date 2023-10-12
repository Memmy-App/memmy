import { CommentView } from 'lemmy-js-client';
import { useCommentStore } from '@src/state/comment/commentStore';

export const addComments = (comments: CommentView[]): void => {
  useCommentStore.setState((state) => {
    const postComments = [];

    for (const comment of comments) {
      postComments.push(comment.comment.id);
      state.comments.set(comment.comment.id, comment);
    }

    state.postComments.set(comments[0].post.id, postComments);
  });
};
