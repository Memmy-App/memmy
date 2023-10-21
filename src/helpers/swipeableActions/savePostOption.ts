import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import instance from '@src/Instance';

export const savePostOption = ({ postId }: SwipeableActionParams): void => {
  void instance.savePost(postId!);
};
