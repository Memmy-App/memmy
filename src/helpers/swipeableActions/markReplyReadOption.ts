import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import instance from '@src/Instance';

export const markReplyReadOption = ({
  replyId,
}: SwipeableActionParams): void => {
  void instance.markReplyRead(replyId!);
};
