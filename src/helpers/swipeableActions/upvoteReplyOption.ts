import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { playHaptic } from '@helpers/haptics';
import { likeReply } from '@src/state/inbox/actions';

export const upvoteReplyOption = ({
  replyId,
  commentId,
}: SwipeableActionParams): void => {
  if (replyId == null || commentId == null) return;
  likeReply(replyId, 1, 'reply');
  void playHaptic();
};
