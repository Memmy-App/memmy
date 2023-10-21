import instance from '@src/Instance';
import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { playHaptic } from '@helpers/haptics';
import { likeReply } from '@src/state/inbox/actions';

export const downvoteReplyOption = ({
  replyId,
  commentId,
}: SwipeableActionParams): void => {
  if (replyId == null || commentId == null) return;

  void instance.likeComment(commentId, -1);
  likeReply(replyId, -1);
  void playHaptic();
};
