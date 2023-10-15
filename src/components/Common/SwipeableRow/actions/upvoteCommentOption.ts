import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';
import instance from '@api/Instance';
import { playHaptic } from '@helpers/haptics';

export const upvoteCommentOption = ({
  commentId,
}: SwipeableActionParams): void => {
  if (commentId == null) return;

  void instance.likeComment(commentId, 1);
  void playHaptic();
};
