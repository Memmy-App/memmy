export const postGestureOptions = [
  'upvote',
  'downvote',
  'save',
  'hide',
  'reply',
  'none',
];

export type IPostGestureOption = (typeof postGestureOptions)[number];
