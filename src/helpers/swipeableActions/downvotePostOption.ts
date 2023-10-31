import instance from '@src/Instance';
import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { playHaptic } from '@helpers/haptics';

export const downvotePostOption = ({ postId }: SwipeableActionParams): void => {
  if (postId == null) return;

  void instance.likePost({ postId, vote: -1 });
  void playHaptic();
};
