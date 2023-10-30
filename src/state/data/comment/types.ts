import { CommentView } from 'lemmy-js-client';

export interface CommentState {
  view: CommentView;
  moderates: boolean;
  isOwnComment: boolean;
}
