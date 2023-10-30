import { useDataStore } from '@src/state';
import {
  CommunityAggregates,
  CommunityModeratorView,
  SubscribedType,
} from 'lemmy-js-client';

export const useCommunityName = (id: number): string | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .name;

export const useCommunityIcon = (id: number): string | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .icon;

export const useCommunityActorId = (id: number): string | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .actor_id;

export const useCommunityAggregates = (
  id: number,
): CommunityAggregates | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.counts;

export const useCommunityModerators = (
  id: number,
): CommunityModeratorView[] | undefined =>
  useDataStore((state) => state.communities.get(id))?.moderators;

export const useCommunitySubscribed = (
  id: number,
): SubscribedType | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.subscribed;

export const useCommunityDescription = (id: number): string | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .description;

export const useCommunityBanner = (id: number): string | undefined =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .banner;

export const useCommunityNsfw = (id: number): boolean =>
  useDataStore((state) => state.communities.get(id))?.community_view.community
    .nsfw ?? false;

export const useCommunityDefaultLanguage = (id: number): number | undefined =>
  useDataStore((state) => state.communities.get(id))?.discussion_languages[0];

export const useCommunityBlocked = (id: number): boolean =>
  useDataStore((state) => state.communities.get(id))?.community_view.blocked ??
  false;
