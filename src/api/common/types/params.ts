import { ILemmyVote } from '@api/lemmy/types';
import { CreatePost, EditPost, GetComments, SortType } from 'lemmy-js-client';

export interface IPostParams {
  postId: number;
}

export interface ILikePostParams extends IPostParams {
  vote: ILemmyVote;
}

export interface ICommentParams {
  commentId: number;
}

export interface ILikeCommentParams extends ICommentParams {
  vote: ILemmyVote;
}

export interface IGetPersonDetailsParams {
  usernameOrId: string | number;
  page?: number;
  sort?: SortType;
}

export interface IGetCommunityParams {
  communityName: string;
  addToStore?: boolean;
}

export interface IGetRepliesParams {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface IGetCommentsParams {
  options: Partial<GetComments>;
  addToPost?: boolean;
}

export interface ISubscribeCommunityParams {
  communityId: number;
  subscribe: boolean;
}

export interface IReportPostParams extends IPostParams {
  reason: string;
}

export interface IReportCommentParams extends ICommentParams {
  reason: string;
}

export interface IBlockPersonParams {
  personId: number;
  block: boolean;
}

export interface IBlockCommunityParams {
  communityId: number;
  block: boolean;
}

export interface IEditCommentParams extends ICommentParams {
  content: string;
}

export interface IEditPostParams {
  options: Partial<EditPost>;
}

export interface ICreateCommentParams extends IPostParams {
  content: string;
  parentId?: number;
}

export interface ICreatePostParams {
  options: Partial<CreatePost>;
}
