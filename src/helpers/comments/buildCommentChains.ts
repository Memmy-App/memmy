import { ICommentInfo } from '@src/types';
import { CommentView } from 'lemmy-js-client';

interface BuildCommentChains {
  commentInfo: ICommentInfo[];
}

let flattenedComments: ICommentInfo[] = [];

const flattenComments = (commentsInfo: ICommentInfo[]): void => {
  for (const commentInfo of commentsInfo) {
    flattenedComments.push(commentInfo);

    if (commentInfo.replies != null) {
      flattenComments(commentInfo.replies);
    }
  }
};

export const buildCommentChains = (
  commentViews: CommentView[],
): BuildCommentChains => {
  const commentInfo: ICommentInfo[] = [];

  if (commentViews.length < 1) {
    return { commentInfo };
  }

  const rootLevel = commentViews[0].comment.path.split('.').length;

  for (const view of commentViews) {
    if (view.comment == null) continue;

    const { path, id } = view.comment;

    const pathIds = path.split('.').map(Number);
    const isRoot = pathIds.length === rootLevel;

    if (isRoot) {
      commentInfo.push({
        postId: view.post.id,
        commentId: id,
        depth: 0,
        replies: buildReplies(id, commentViews, rootLevel),
        collapsed: false,
        hidden: false,
        path,
        showInPost: true,
        showLoadMore: false,
        topId: pathIds[1],
      });
    }
  }

  flattenComments(commentInfo);

  const res = {
    commentInfo: flattenedComments,
  };

  flattenedComments = [];

  return res;
};

const buildReplies = (
  parentId: number,
  commentViews: CommentView[],
  rootLevel: number,
): ICommentInfo[] => {
  const replies: ICommentInfo[] = [];

  const replyCommentViews = commentViews.filter((view) =>
    view.comment.path.includes(`.${parentId}.`),
  );

  let i = 0;

  for (const view of replyCommentViews) {
    const { path, id } = view.comment;

    const pathIds = path.split('.').map(Number);
    const currentParentId = pathIds[pathIds.length - 2];

    const depth = pathIds.length - 2;

    if (parentId === currentParentId) {
      replies.push({
        postId: view.post.id,
        commentId: id,
        depth: pathIds.length - rootLevel,
        replies: buildReplies(id, commentViews, rootLevel),
        collapsed: false,
        hidden: false,
        path,
        showInPost: i <= 3 && depth <= 4,
        showLoadMore: i === 3 || (depth === 4 && i === 0),
        topId: pathIds[1],
        parentId: pathIds[pathIds.length - 2],
      });

      i++;
    }
  }

  return replies;
};
