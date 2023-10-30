import { ICommentInfo, LinkType } from '@src/types';
import { PostView } from 'lemmy-js-client';

export interface PostState {
  view: PostView;
  commentInfo?: ICommentInfo[];
  usedBy: string[];
  linkType: LinkType;
  bodyPreview?: string;
  moderates: boolean;
  isOwnPost: boolean;
}
