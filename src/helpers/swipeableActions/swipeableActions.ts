import { ICommentGestureOption, IPostGestureOption } from '@src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { upvotePostOption } from '@helpers/swipeableActions/upvotePostOption';
import { downvotePostOption } from '@helpers/swipeableActions/downvotePostOption';
import { savePostOption } from '@helpers/swipeableActions/savePostOption';
import { replyOption } from '@helpers/swipeableActions/replyOption';
import { customOption } from '@helpers/swipeableActions/customOption';
import { upvoteCommentOption } from '@helpers/swipeableActions/upvoteCommentOption';
import { downvoteCommentOption } from '@helpers/swipeableActions/downvoteCommentOption';
import { IReplyGestureOption } from '@src/types/IReplyGestureOptions';
import { markReplyReadOption } from '@helpers/swipeableActions/markReplyReadOption';
import { downvoteReplyOption } from '@helpers/swipeableActions/downvoteReplyOption';
import { upvoteReplyOption } from '@helpers/swipeableActions/upvoteReplyOption';
import { saveCommentOption } from '@helpers/swipeableActions/saveCommentOption';
import { markMentionReadOption } from '@helpers/swipeableActions/markMentionReadOption';
import { downvoteMentionOption } from '@helpers/swipeableActions/downvoteMentionOption';
import { upvoteMentionOption } from '@helpers/swipeableActions/upvoteMentionOption';
import { collapseCommentOption } from '@helpers/swipeableActions/collapseCommentOption';

export interface SwipeableActionParams {
  commentId?: number;
  postId?: number;
  replyId?: number;
  messageId?: number;
  mentionId?: number;
  screenId?: string;
  path?: string;
  navigation: NativeStackNavigationProp<any>;
  custom?: (params?: SwipeableActionParams) => unknown;
}

export const postSwipeableActions: Record<
  IPostGestureOption,
  (...args: any[]) => any
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
  save: saveCommentOption,
  collapse: collapseCommentOption,
  reply: replyOption,
  hide: () => {},
};

export const replySwipeableActions: Record<
  IReplyGestureOption,
  (...args: any[]) => any
> = {
  upvote: upvoteReplyOption,
  downvote: downvoteReplyOption,
  read: markReplyReadOption,
  reply: replyOption,
};

export const mentionSwipeableActions: Record<
  IReplyGestureOption,
  (...args: any[]) => any
> = {
  upvote: upvoteMentionOption,
  downvote: downvoteMentionOption,
  read: markMentionReadOption,
  reply: replyOption,
};
