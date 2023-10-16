import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';

export const replyOption = ({
  commentId,
  postId,
  navigation,
}: SwipeableActionParams): void => {
  navigation.push('Reply', { commentId, postId });
};
