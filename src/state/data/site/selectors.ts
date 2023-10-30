import { useDataStore } from '@src/state';
import {
  CommunityBlockView,
  CommunityView,
  Language,
  PersonBlockView,
} from 'lemmy-js-client';

export const usePersonAvatar = (): string | undefined =>
  useDataStore(
    (state) => state.site.site?.my_user?.local_user_view.person.avatar,
  );

export const useDefaultLanguage = (): number | undefined =>
  useDataStore((state) => state.site.site?.my_user?.discussion_languages[0]);

export const useShowNsfw = (): boolean =>
  useDataStore(
    (state) => state.site.site?.my_user?.local_user_view.local_user.show_nsfw,
  ) ?? false;

export const useSiteLanguages = (): Language[] | undefined =>
  useDataStore((state) => state.site.site?.all_languages);

export const useSiteDefaultLanguage = (): number | undefined =>
  useDataStore((state) => state.site.site?.discussion_languages[0]);

export const useSubscriptions = (): CommunityView[] =>
  useDataStore((state) => state.site.subscriptions);

export const useShowReadPosts = (): boolean =>
  useDataStore(
    (state) =>
      state.site.site?.my_user?.local_user_view.local_user.show_read_posts,
  ) ?? false;

export const useBlockedPersons = (): PersonBlockView[] | undefined =>
  useDataStore((state) => state.site.site?.my_user?.person_blocks);

export const useBlockedCommunities = (): CommunityBlockView[] | undefined =>
  useDataStore((state) => state.site.site?.my_user?.community_blocks);
