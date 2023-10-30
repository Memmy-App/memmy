import { useDataStore } from '@src/state';

interface SetPostCommentHiddenParams {
  commentId: number;
  postId: number;
  path: string;
}

export const setPostCommentHidden = ({
  commentId,
  postId,
  path,
}: SetPostCommentHiddenParams): void => {
  useDataStore.setState((state) => {
    const postComments = state.posts.get(postId)?.commentInfo;
    const currentComment = postComments?.find((c) => c.commentId === commentId);

    if (postComments == null || currentComment == null) return;

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

interface ShowMoreCommentsNextedParams {
  commentId: number;
  postId: number;
}

export const showMoreCommentsNexted = ({
  commentId,
  postId,
}: ShowMoreCommentsNextedParams): void => {
  useDataStore.setState((state) => {
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
