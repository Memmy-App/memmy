import {
  CommentView,
  CommunityModeratorView,
  GetPersonDetailsResponse,
  PersonAggregates,
  PostView,
} from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ProfileStore {
  profiles: Map<number, GetPersonDetailsResponse>;
}

export const useProfileStore = create(
  immer<ProfileStore>(() => ({
    profiles: new Map<number, GetPersonDetailsResponse>(),
  })),
);

export const useProfile = (
  personId: number,
): GetPersonDetailsResponse | undefined =>
  useProfileStore((state) => state.profiles.get(personId));

export const useProfilePosts = (personId: number): PostView[] | undefined =>
  useProfileStore((state) => state.profiles.get(personId)?.posts);

export const useProfileComments = (
  personId: number,
): CommentView[] | undefined =>
  useProfileStore((state) => state.profiles.get(personId)?.comments);

export const useProfileModerates = (
  personId: number,
): CommunityModeratorView[] | undefined =>
  useProfileStore((state) => state.profiles.get(personId)?.moderates);

export const useProfileName = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.name,
  );

export const useProfileDisplayName = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.display_name,
  );

export const useProfileAvatar = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.avatar,
  );

export const useProfileBanner = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.banner,
  );

export const useProfileBio = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.bio,
  );

export const useProfileIsAdmin = (personId: number): boolean | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.admin,
  );

export const useProfileCounts = (
  personId: number,
): PersonAggregates | undefined =>
  useProfileStore((state) => state.profiles.get(personId)?.person_view.counts);

export const useProfileActorId = (personId: number): string | undefined =>
  useProfileStore(
    (state) => state.profiles.get(personId)?.person_view.person.actor_id,
  );
