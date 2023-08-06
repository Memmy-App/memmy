import { CommentSortType, ListingType, SortType } from "lemmy-js-client";
import { ThemeOptions, ThemeOptionsMap } from "@src/theme/themeOptions";
import { HapticOptions } from "@src/types/haptics/hapticOptions";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { theme as GluestackTheme } from "@root/gluestack-ui.config";
import merge from "deepmerge";
import { ICustomConfig } from "@gluestack-style/react";
import { systemFontSettings } from "@src/theme/common";
import { ITheme } from "@src/theme/theme";

interface SettingsStore {
  settings: SettingsState;
}

export interface SettingsState {
  swipeGestures: boolean;
  displayImagesInFeed: string;
  defaultSort: SortType;
  defaultCommentSort: CommentSortType;
  defaultListingType: ListingType;
  showInstanceForUsernames: boolean;
  loaded: boolean;
  blurNsfw: boolean;
  hideNsfw: boolean;
  compactView: boolean;
  colorScheme: "light" | "dark" | null | undefined;
  theme: ThemeOptions;
  themeLight: ThemeOptions;
  themeDark: ThemeOptions;
  themeMatchSystem: boolean;
  isSystemFont: boolean;
  isSystemTextSize: boolean;
  fontSize: number;
  fontWeightPostTitle: string;
  haptics: HapticOptions;
  pushEnabled: string;
  compactThumbnailPosition: "None" | "Left" | "Right";
  compactShowVotingButtons: boolean;
  markReadOnPostView: boolean;
  markReadOnPostImageView: boolean;
  markReadOnPostVote: boolean;
  markReadOnFeedScroll: boolean;
  markReadOnCommunityScroll: boolean;
  ignoreScreenHeightInFeed: boolean;
  displayTotalScore: boolean;
  useReaderMode: boolean;
  accentColor?: string;
  hideReadPostsOnFeed: boolean;
  hideReadPostsInCommunities: boolean;
  showHideReadButton: boolean;
  appIcon: string;
  showCommentActions: boolean;
  useDefaultBrowser: boolean;
  tapToCollapse: boolean;
  swipeToVote: boolean;
  hideUsernameInTab: boolean;
  hideAvatarInTab: boolean;
  commentSwipeLeftFirst: "Reply" | "Save" | "Collapse";
  commentSwipeLeftSecond: "Reply" | "Save" | "Collapse" | "None";
  showCommentJumpButton: boolean;
  commentJumpPlacement: "bottom left" | "bottom right" | "bottom center";
}

const initialState: SettingsState = {
  swipeGestures: true,
  displayImagesInFeed: "true",
  defaultSort: "Hot",
  defaultCommentSort: "Top",
  defaultListingType: "All",
  showInstanceForUsernames: false,
  loaded: false,
  blurNsfw: true,
  hideNsfw: true,
  compactView: false,
  compactThumbnailPosition: "Left",
  compactShowVotingButtons: true,
  colorScheme: "dark",
  theme: "Dark",
  themeLight: "Light",
  themeDark: "Dark",
  themeMatchSystem: false,
  isSystemFont: false,
  isSystemTextSize: true,
  fontSize: 2,
  fontWeightPostTitle: "normal",
  haptics: "Medium",
  pushEnabled: "[]",
  markReadOnPostView: true,
  markReadOnPostImageView: true,
  markReadOnPostVote: true,
  markReadOnFeedScroll: false,
  markReadOnCommunityScroll: false,
  ignoreScreenHeightInFeed: false,
  displayTotalScore: false,
  useReaderMode: false,
  hideReadPostsOnFeed: false,
  hideReadPostsInCommunities: false,
  showHideReadButton: false,
  appIcon: "purple",
  showCommentActions: true,
  useDefaultBrowser: false,
  tapToCollapse: true,
  swipeToVote: true,
  hideUsernameInTab: false,
  hideAvatarInTab: false,
  commentSwipeLeftFirst: "Reply",
  commentSwipeLeftSecond: "None",
  showCommentJumpButton: true,
  commentJumpPlacement: "bottom right",
};

export const useSettingsStore = create(
  immer<SettingsStore>(() => ({
    settings: initialState,
  }))
);

export const useCurrentTheme = () =>
  useSettingsStore((state) => {
    if (state.settings.themeMatchSystem) {
      if (state.settings.colorScheme === "light") {
        return state.settings.themeLight;
      }
      return state.settings.themeDark;
    }
    return state.settings.theme;
  });

// @ts-ignore
export const useThemeOptions = () =>
  useSettingsStore(
    (state) =>
      merge.all([
        ThemeOptionsMap[
          state.settings.themeMatchSystem
            ? state.settings.colorScheme === "light"
              ? state.settings.themeLight
              : state.settings.themeDark
            : state.settings.theme
        ],
        state.settings.accentColor
          ? {
              colors: {
                accent: state.settings.accentColor,
              },
            }
          : {},
      ]) as ITheme
  );

export const useThemeConfig = () =>
  useSettingsStore(
    (state) =>
      merge.all([
        GluestackTheme,
        {
          tokens: {
            colors: {
              ...ThemeOptionsMap[
                state.settings.themeMatchSystem
                  ? state.settings.colorScheme === "light"
                    ? state.settings.themeLight
                    : state.settings.themeDark
                  : state.settings.theme
              ].colors,
            },
          },
        },
        state.settings.accentColor
          ? {
              tokens: {
                colors: {
                  accent: state.settings.accentColor,
                },
              },
            }
          : {},
        state.settings.isSystemTextSize
          ? {
              components: {
                Text: {
                  defaultProps: {
                    allowFontScaling: false,
                  },
                },
              },
            }
          : {
              components: {
                Text: {
                  defaultProps: {
                    fontSize: state.settings.fontSize,
                  },
                },
              },
            },
        state.settings.isSystemFont ? systemFontSettings : {},
      ]) as ICustomConfig
  );

export const useSettings = () => useSettingsStore((state) => state.settings);
