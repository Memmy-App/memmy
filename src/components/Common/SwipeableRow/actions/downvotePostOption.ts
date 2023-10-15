import instance from '@src/Instance';
import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';
import { playHaptic } from '@helpers/haptics';

export const downvotePostOption = ({ postId }: SwipeableActionParams): void => {
  if (postId == null) return;

  void instance.likePost(postId, -1);
  void playHaptic();
};
