import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import instance from '@src/Instance';

export const saveCommentOption = ({
  commentId,
}: SwipeableActionParams): void => {
  void instance.saveComment(commentId!);
};
