import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { setPostCommentHidden } from '@src/state';

export const collapseCommentOption = ({
  commentId,
  path,
  postId,
}: SwipeableActionParams): void => {
  setPostCommentHidden({
    commentId: commentId!,
    postId: postId!,
    path: path!,
  });
};
