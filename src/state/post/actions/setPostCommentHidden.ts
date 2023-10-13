import { ICommentInfo } from '@src/types';
import { usePostStore } from '@src/state/post/postStore';

export const setPostCommentHidden = (
  commentInfo: ICommentInfo,
  hidden: boolean,
): void => {
  usePostStore.setState((state) => {
    const postComments = state.posts.get(commentInfo.postId)?.commentInfo;

    if (postComments == null) return;

    for (const comment of postComments) {
      if (comment.path === commentInfo.path) {
        comment.collapsed = hidden;
      } else if (comment.path.includes(commentInfo.path)) {
        comment.hidden = hidden;
      }
    }
  });
};
