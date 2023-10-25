import { usePostStore } from '@src/state';

export const setPostCommentHidden = (
  commentId: number,
  postId: number,
  path: string,
): void => {
  usePostStore.setState((state) => {
    const postComments = state.posts.get(postId)?.commentInfo;

    if (postComments == null) return;

    const currentComment = postComments.find((c) => c.commentId === commentId);

    if (currentComment == null) return;

    const hidden = !currentComment.collapsed;

    for (const comment of postComments) {
      if (comment.path === path) {
        comment.collapsed = hidden;
      } else if (comment.path.includes(path)) {
        comment.hidden = hidden;
      }
    }
  });
};

export const showMoreCommentsNexted = (
  commentId: number,
  postId: number,
): void => {
  usePostStore.setState((state) => {
    const postComments = state.posts.get(postId)?.commentInfo;

    if (postComments == null) return;

    const currentComment = postComments.find((c) => c.commentId === commentId);

    if (currentComment == null) return;

    currentComment.showLoadMore = false;
    const pathArr = currentComment.path.split('.');
    const parentId = pathArr[pathArr.length - 2];

    for (const comment of postComments) {
      if (comment.path.includes(parentId)) {
        comment.showInPost = true;
      }
    }
  });
};
