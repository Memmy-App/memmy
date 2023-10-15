import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';

export const replyOption = ({
  commentId,
  postId,
  navigation,
}: SwipeableActionParams): void => {
  navigation.navigate('Reply', { commentId, postId });
};
