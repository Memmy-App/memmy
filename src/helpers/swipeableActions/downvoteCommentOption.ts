import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import instance from '@src/Instance';
import { playHaptic } from '@helpers/haptics';

export const downvoteCommentOption = ({
  commentId,
}: SwipeableActionParams): void => {
  if (commentId == null) return;

  void instance.likeComment(commentId, -1);
  void playHaptic();
};
