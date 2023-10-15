export const commentGestureOptions = [
  'upvote',
  'downvote',
  'save',
  'collapse',
  'reply',
  'none',
];

export type ICommentGestureOption = (typeof commentGestureOptions)[number];
