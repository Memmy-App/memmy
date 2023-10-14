import instance from '@api/Instance';
import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';

export const downvotePostOption = ({ itemId }: SwipeableActionParams): void => {
  if (itemId == null) return;

  void instance.likePost(itemId, -1);
};
