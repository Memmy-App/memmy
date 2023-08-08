import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommentSortType, ListingType, SortType } from "lemmy-js-client";
import { ICustomConfig } from "@gluestack-style/react";
import { ThemeOptions, ThemeOptionsMap } from "@src/theme/themeOptions";
import { HapticOptions } from "@src/types/HapticOptions";
import { ITheme } from "@src/theme/theme";
import { systemFontSettings } from "@src/theme/common";
import { theme as GluestackTheme } from "@root/gluestack-ui.config";
import merge from "deepmerge";

export interface SettingsStore {
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

const initialState: SettingsStore = {
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
  persist(
    immer<SettingsStore>(() => ({
      ...initialState,
    })),
    {
      name: "account",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCurrentTheme = (): string =>
  useSettingsStore((state) => {
    if (state.themeMatchSystem) {
      if (state.colorScheme === "light") {
        return state.themeLight;
      }
      return state.themeDark;
    }
    return state.theme;
  });

// @ts-ignore
export const useThemeOptions = (): ITheme =>
  useSettingsStore(
    (state) =>
      merge.all([
        ThemeOptionsMap[
          state.themeMatchSystem
            ? state.colorScheme === "light"
              ? state.themeLight
              : state.themeDark
            : state.theme
        ],
        state.accentColor
          ? {
              colors: {
                accent: state.accentColor,
              },
            }
          : {},
      ]) as ITheme
  );

export const useThemeConfig = (): ICustomConfig =>
  useSettingsStore(
    (state) =>
      merge.all([
        GluestackTheme,
        {
          tokens: {
            colors: {
              // TODO Theme
              ...ThemeOptionsMap.Dracula.colors,
            },
          },
        },
        state.accentColor
          ? {
              tokens: {
                colors: {
                  accent: state.accentColor,
                },
              },
            }
          : {},
        state.isSystemTextSize
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
                    fontSize: state.fontSize,
                  },
                },
              },
            },
        state.isSystemFont ? systemFontSettings : {},
      ]) as ICustomConfig
  );
