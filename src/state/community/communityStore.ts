import {
  CommunityAggregates,
  CommunityModeratorView,
  GetCommunityResponse,
  SubscribedType,
} from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface CommunityStore {
  communities: Map<number, GetCommunityResponse>;
}

export const useCommunityStore = create(
  immer<CommunityStore>(() => ({
    communities: new Map<number, GetCommunityResponse>(),
  })),
);

export const useCommunity = (id: number): GetCommunityResponse | undefined =>
  useCommunityStore((state) => state.communities.get(id));

export const useCommunityName = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.name;

export const useCommunityIcon = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.icon;

export const useCommunityActorId = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.actor_id;

export const useCommunityAggregates = (
  id: number,
): CommunityAggregates | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .counts;

export const useCommunityModerators = (
  id: number,
): CommunityModeratorView[] | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.moderators;

export const useCommunitySubscribed = (
  id: number,
): SubscribedType | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .subscribed;

export const useCommunityDisplayName = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.title;

export const useCommunityDescription = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.description;

export const useCommunityBanner = (id: number): string | undefined =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.banner;

export const useCommunityNsfw = (id: number): boolean =>
  useCommunityStore((state) => state.communities.get(id))?.community_view
    .community.nsfw ?? false;
