import { Person, Post, PostAggregates, PostView } from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ICommentInfo, LinkType } from '@src/types';

export interface PostState {
  view: PostView;
  commentInfo?: ICommentInfo[];
  usedBy: string[];
  linkType: LinkType;
  bodyPreview?: string;
  moderates: boolean;
  isOwnPost: boolean;
}

export interface PostStore {
  posts: Map<number, PostState>;
}

export const usePostStore = create(
  immer<PostStore>(() => ({
    posts: new Map<number, PostState>(),
  })),
);

export const usePostLoaded = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id) !== undefined);

export const usePostView = (id: number): PostView | undefined =>
  usePostStore((state) => state.posts.get(id))?.view;

export const usePostCommentsInfo = (id: number): ICommentInfo[] | undefined =>
  usePostStore((state) => state.posts.get(id))?.commentInfo;

export const usePost = (id: number): Post | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post;

export const usePostCounts = (id: number): PostAggregates | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.counts;

export const usePostRead = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.read ?? false;

export const usePostCreator = (id: number): Person | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.creator;

export const usePostCommentCount = (id: number): number | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.counts.comments;

export const usePostTitle = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.name;

export interface IPostCommunityName {
  community: string | undefined;
  instance: string | undefined;
}

export const usePostCommunityName = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.name;

export const usePostCommunityActorId = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.actor_id;

export const usePostCommunityIcon = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.icon;

export const usePostMyVote = (id: number): number | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.my_vote;

export const usePostSaved = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.saved ?? false;

export const usePostLink = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.url;

export const usePostThumbnail = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.thumbnail_url;

export const usePostBody = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.body;

export const usePostLinkType = (id: number): LinkType | undefined =>
  usePostStore((state) => state.posts.get(id))?.linkType;

export const usePostBodyPreview = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.bodyPreview;

export const usePostActorId = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.ap_id;

export const usePostCommunityId = (id: number): number | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.id;

export const usePostNsfw = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.post.nsfw ?? false;

export const usePostCommunityNsfw = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.community.nsfw ?? false;

export const usePostModerates = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.moderates ?? false;

export const usePostIsOwn = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.isOwnPost ?? false;

export const usePostRemoved = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.post.removed ?? false;

export const usePostDeleted = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.post.deleted ?? false;

export const usePostPublished = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.counts.published;
