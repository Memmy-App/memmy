import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import instance from '@src/Instance';

export const markMentionReadOption = ({
  mentionId,
}: SwipeableActionParams): void => {
  void instance.markMentionRead(mentionId!);
};
