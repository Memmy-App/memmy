import { ICommentGestureOptions, IPostGestureOption } from '@src/types';
import { upvotePostOption } from '@components/Common/SwipeableRow/actions/upvotePostOption';
import { downvotePostOption } from '@components/Common/SwipeableRow/actions/downvotePostOption';

export interface SwipeableActionParams {
  itemId?: number;
  screenId?: string;
}

export const postSwipeableActions: Record<
  IPostGestureOption,
  (params: SwipeableActionParams) => any
> = {
  upvote: upvotePostOption,
  downvote: downvotePostOption,
  save: () => {},
  hide: () => {},
  reply: () => {},
};

export const commentSwipeableActions: Record<
  ICommentGestureOptions,
  (...args: any[]) => any
> = {
  upvote: () => {},
  downvote: () => {},
  save: () => {},
  collapse: () => {},
  reply: () => {},
};
