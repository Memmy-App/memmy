import { LinkType } from '@src/types';

export interface PostPair {
  postId: number;
  linkType: LinkType;
}

export interface FeedState {
  feedId: string;
  communityName?: string;
  postPairs: PostPair[];
  nextPage: number;
}
