import {
  CommunityModeratorView,
  CommunityView,
  GetSiteResponse,
  Language,
} from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface SiteStore {
  site?: GetSiteResponse;
  setSite: (site: GetSiteResponse) => void;
  subscriptions: CommunityView[];
  moderated: CommunityView[];
  moderatedIds?: number[];
}

export const useSiteStore = create(
  immer<SiteStore>((set) => ({
    site: undefined,
    subscriptions: [],
    moderated: [],

    setSite: (site: GetSiteResponse) => {
      set((state) => {
        state.site = site;
        state.moderatedIds = site.my_user?.moderates.map((m) => m.community.id);
      });
    },
  })),
);

export const usePersonId = (): number | undefined =>
  useSiteStore((state) => state.site?.my_user?.local_user_view.person.id);

export const useModerates = (): CommunityModeratorView[] | undefined =>
  useSiteStore((state) => state.site?.my_user?.moderates);

export const useModeratedIds = (): number[] | undefined =>
  useSiteStore((state) => state.moderatedIds);

export const usePersonAvatar = (): string | undefined =>
  useSiteStore((state) => state.site?.my_user?.local_user_view.person.avatar);

export const useDefaultLanguage = (): number | undefined =>
  useSiteStore((state) => state.site?.my_user?.discussion_languages[0]);

export const useShowNsfw = (): boolean | undefined =>
  useSiteStore(
    (state) => state.site?.my_user?.local_user_view.local_user.show_nsfw,
  );

export const useSiteLanguages = (): Language[] | undefined =>
  useSiteStore((state) => state.site?.all_languages);

export const useSiteDefaultLanguage = (): number | undefined =>
  useSiteStore((state) => state.site?.discussion_languages[0]);

export const useSubscriptions = (): CommunityView[] =>
  useSiteStore((state) => state.subscriptions);

export const useSubscription = (id: number): CommunityView | undefined =>
  useSiteStore((state) =>
    state.subscriptions.find((c) => c.community.id === id),
  );
