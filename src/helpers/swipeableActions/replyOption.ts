import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';

export const replyOption = ({
  commentId,
  postId,
  navigation,
}: SwipeableActionParams): void => {
  navigation.navigate('Reply', { commentId, postId });
};
