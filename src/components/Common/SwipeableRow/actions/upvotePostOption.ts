import instance from '@api/Instance';
import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';
import { playHaptic } from '@helpers/haptics';

export const upvotePostOption = ({ postId }: SwipeableActionParams): void => {
  if (postId == null) return;

  void instance.likePost(postId, 1);
  void playHaptic();
};
