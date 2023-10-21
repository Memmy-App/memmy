import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';

export const markReplyReadOption = ({
  commentId,
  postId,
  navigation,
}: SwipeableActionParams): void => {
  navigation.push('Reply', { commentId, postId });
};
