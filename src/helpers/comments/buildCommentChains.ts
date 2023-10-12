import { ICommentInfo } from '@src/types';
import { CommentView } from 'lemmy-js-client';

interface BuildCommentChains {
  commentInfo: ICommentInfo[];
}

export const buildCommentChains = (
  commentViews: CommentView[],
): BuildCommentChains => {
  const commentInfo: ICommentInfo[] = [];

  for (const view of commentViews) {
    if (view.comment == null) continue;

    const { path, id } = view.comment;

    const pathIds = path.split('.').map(Number);
    const parentId = pathIds[pathIds.length - 2];
    const isRoot = parentId === 0;

    if (isRoot) {
      commentInfo.push({
        postId: view.post.id,
        commentId: id,
        depth: 0,
        replies: buildReplies(id, commentViews),
      });
    }
  }

  return {
    commentInfo,
  };
};

const buildReplies = (
  parentId: number,
  commentViews: CommentView[],
): ICommentInfo[] => {
  const replies: ICommentInfo[] = [];

  const replyCommentViews = commentViews.filter((view) =>
    view.comment.path.includes(`.${parentId}.`),
  );

  for (const view of replyCommentViews) {
    const { path, id } = view.comment;

    const pathIds = path.split('.').map(Number);
    const currentParentId = pathIds[pathIds.length - 2];

    if (parentId === currentParentId) {
      replies.push({
        postId: view.post.id,
        commentId: id,
        depth: pathIds.length - 2,
        replies: buildReplies(id, commentViews),
      });
    }
  }

  return replies;
};
