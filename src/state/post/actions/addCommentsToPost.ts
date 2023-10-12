import { usePostStore } from '@src/state/post/postStore';
import { ICommentInfo } from '@src/types';

export const addCommentsToPost = (
  postId: number,
  commentInfo: ICommentInfo[],
): void => {
  usePostStore.setState((state) => {
    const post = state.posts.get(postId);

    if (post == null) return;

    post.commentInfo = commentInfo;
  });
};
