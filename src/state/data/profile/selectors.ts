import { CommentView, PersonAggregates, PostView } from 'lemmy-js-client';
import { useDataStore } from '@src/state';

export const useProfilePosts = (personId: number): PostView[] | undefined =>
  useDataStore((state) => state.profiles.get(personId)?.posts);

export const useProfileComments = (
  personId: number,
): CommentView[] | undefined =>
  useDataStore((state) => state.profiles.get(personId)?.comments);

export const useProfileName = (personId: number): string | undefined =>
  useDataStore(
    (state) => state.profiles.get(personId)?.person_view.person.name,
  );

export const useProfileAvatar = (personId: number): string | undefined =>
  useDataStore(
    (state) => state.profiles.get(personId)?.person_view.person.avatar,
  );

export const useProfileBanner = (personId: number): string | undefined =>
  useDataStore(
    (state) => state.profiles.get(personId)?.person_view.person.banner,
  );

export const useProfileBio = (personId: number): string | undefined =>
  useDataStore((state) => state.profiles.get(personId)?.person_view.person.bio);

export const useProfileCounts = (
  personId: number,
): PersonAggregates | undefined =>
  useDataStore((state) => state.profiles.get(personId)?.person_view.counts);

export const useProfileActorId = (personId: number): string | undefined =>
  useDataStore(
    (state) => state.profiles.get(personId)?.person_view.person.actor_id,
  );
