import { useDataStore } from '@src/state';
import { Person, PostAggregates } from 'lemmy-js-client';
import { ICommentInfo, LinkType } from '@src/types';

export const usePostCommentsInfo = (id: number): ICommentInfo[] | undefined =>
  useDataStore((state) => state.posts.get(id))?.commentInfo;

export const usePostCounts = (id: number): PostAggregates | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.counts;

export const usePostRead = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.read ?? false;

export const usePostCreator = (id: number): Person | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.creator;

export const usePostCommentCount = (id: number): number | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.counts.comments;

export const usePostTitle = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.name;

export const usePostCommunityName = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.community.name;

export const usePostCommunityActorId = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.community.actor_id;

export const usePostCommunityIcon = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.community.icon;

export const usePostMyVote = (id: number): number | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.my_vote;

export const usePostSaved = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.saved ?? false;

export const usePostLink = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.url;

export const usePostThumbnail = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.thumbnail_url;

export const usePostBody = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.body;

export const usePostLinkType = (id: number): LinkType | undefined =>
  useDataStore((state) => state.posts.get(id))?.linkType;

export const usePostBodyPreview = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.bodyPreview;

export const usePostActorId = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.ap_id;

export const usePostCommunityId = (id: number): number | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.community.id;

export const usePostNsfw = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.post.nsfw ?? false;

export const usePostCommunityNsfw = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.community.nsfw ?? false;

export const usePostModerates = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.moderates ?? false;

export const usePostIsOwn = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.isOwnPost ?? false;

export const usePostRemoved = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.post.removed ?? false;

export const usePostDeleted = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.post.deleted ?? false;

export const usePostPublished = (id: number): string | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.counts.published;

export const usePostLanguageId = (id: number): number | undefined =>
  useDataStore((state) => state.posts.get(id))?.view.post.language_id;

export const usePostCreatorAdmin = (id: number): boolean =>
  useDataStore((state) => state.posts.get(id))?.view.creator.admin ?? false;

export const usePostCreatorId = (id?: number): number | undefined =>
  useDataStore((state) => state.posts.get(id ?? 0))?.view.creator.id;
