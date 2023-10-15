import { ICommentGestureOption, IPostGestureOption } from '@src/types';
import { upvotePostOption } from '@components/Common/SwipeableRow/actions/upvotePostOption';
import { downvotePostOption } from '@components/Common/SwipeableRow/actions/downvotePostOption';
import { upvoteCommentOption } from '@components/Common/SwipeableRow/actions/upvoteCommentOption';
import { downvoteCommentOption } from '@components/Common/SwipeableRow/actions/downvoteCommentOption';
import { savePostOption } from '@components/Common/SwipeableRow/actions/savePostOption';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { replyOption } from '@components/Common/SwipeableRow/actions/replyOption';
import { customOption } from '@components/Common/SwipeableRow/actions/customOption';

export interface SwipeableActionParams {
  commentId?: number;
  postId?: number;
  screenId?: string;
  navigation: NativeStackNavigationProp<any>;
  custom?: (params?: SwipeableActionParams) => unknown;
}

export const postSwipeableActions: Record<
  IPostGestureOption,
  (params: SwipeableActionParams) => any
> = {
  upvote: upvotePostOption,
  downvote: downvotePostOption,
  save: savePostOption,
  hide: () => {},
  reply: replyOption,
  custom: customOption,
};

export const commentSwipeableActions: Record<
  ICommentGestureOption,
  (...args: any[]) => any
> = {
  upvote: upvoteCommentOption,
  downvote: downvoteCommentOption,
  save: () => {},
  collapse: () => {},
  reply: () => {},
  hide: () => {},
};
