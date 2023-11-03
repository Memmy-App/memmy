export const postGestureOptions = [
  'upvote',
  'downvote',
  'save',
  'hide',
  'reply',
  'share',
  'none',
];

export type IPostGestureOption = (typeof postGestureOptions)[number];
