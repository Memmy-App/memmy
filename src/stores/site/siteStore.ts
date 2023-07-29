import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  CustomEmojiView,
  Language,
  MyUserInfo,
  PersonView,
  SiteView,
  Tagline,
} from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";

interface SiteStore {
  admins: PersonView[];
  allLanguages: Language[];
  customEmojis: CustomEmojiView[];
  discussionLanguages: number[];
  me: MyUserInfo | null;
  site: SiteView | null;
  taglines: Tagline[];
  version: string | null;

  init: () => Promise<void>;
}

export const useSiteStore = create(
  immer<SiteStore>((set) => ({
    admins: [],
    allLanguages: [],
    customEmojis: [],
    discussionLanguages: [],
    me: null,
    site: null,
    taglines: [],
    version: null,

    init: async () => {
      try {
        const res = await lemmyInstance.getSite({
          auth: lemmyAuthToken,
        });

        set((state) => {
          state.admins = res.admins;
          state.allLanguages = res.all_languages;
          state.customEmojis = res.custom_emojis;
          state.discussionLanguages = res.discussion_languages;
          state.me = res.my_user;
          state.site = res.site_view;
          state.taglines = res.taglines;
          state.version = res.version;
        });
      } catch (e) {
        handleLemmyError(e.toString());
      }
    },
  }))
);

export const useAdmins = () => useSiteStore((state) => state.admins);
export const useAllLangs = () => useSiteStore((state) => state.allLanguages);
export const useCustomEmojis = () =>
  useSiteStore((state) => state.customEmojis);
export const useDiscussionLangs = () =>
  useSiteStore((state) => state.discussionLanguages);
export const useMe = () => useSiteStore((state) => state.me);
export const useSite = () => useSiteStore((state) => state.site);
export const useLemmyVersion = () => useSiteStore((state) => state.version);
export const useTaglines = () => useSiteStore((state) => state.taglines);
