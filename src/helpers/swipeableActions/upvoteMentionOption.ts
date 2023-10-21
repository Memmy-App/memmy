import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { playHaptic } from '@helpers/haptics';
import { likeReply } from '@src/state/inbox/actions';

export const upvoteMentionOption = ({
  mentionId,
  commentId,
}: SwipeableActionParams): void => {
  if (mentionId == null || commentId == null) return;
  likeReply(mentionId, 1, 'mention');
  void playHaptic();
};
