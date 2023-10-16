import {
  CommunityModeratorView,
  CommunityView,
  GetSiteResponse,
} from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface SiteStore {
  site?: GetSiteResponse;
  setSite: (site: GetSiteResponse) => void;
  subscriptions?: CommunityView[];
  moderated?: CommunityView[];
  moderatedIds?: number[];
}

export const useSiteStore = create(
  immer<SiteStore>((set) => ({
    site: undefined,

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
