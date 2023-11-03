export const commentGestureOptions = [
  'upvote',
  'downvote',
  'save',
  'collapse',
  'reply',
  'share',
  'none',
];

export type ICommentGestureOption = (typeof commentGestureOptions)[number];
