import { GetSiteResponse } from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface SiteStore {
  site?: GetSiteResponse;
  setSite: (site: GetSiteResponse) => void;
}

export const useSiteStore = create(
  immer<SiteStore>((set) => ({
    site: undefined,

    setSite: (site: GetSiteResponse) => {
      set((state) => {
        state.site = site;
      });
    },
  })),
);
