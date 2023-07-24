import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ThemeOptionsArr, ThemeOptionsMap } from "@src/theme/themeOptions";
import { theme as GluestackTheme } from "@root/gluestack-ui.config";
import { ICustomConfig } from "@gluestack-style/react";
import { CommentSortType, ListingType, SortType } from "lemmy-js-client";
import merge from "deepmerge";
import { RootState } from "../../../store";
import { loadSettings, setSetting } from "./settingsActions";
import { ThemeOptions } from "../../theme/themeOptions";
import { HapticOptions } from "../../types/haptics/hapticOptions";

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
  displayTotalScore: true,
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
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (state: SettingsState, action) => {
      if (action.payload) {
        // eslint-disable-next-line guard-for-in
        for (const key in action.payload) {
          state[key] = action.payload[key];
        }
      }

      state.loaded = true;
    });

    builder.addCase(loadSettings.rejected, (state) => {
      state.loaded = true;
    });

    builder.addCase(setSetting.fulfilled, (state, action) => {
      // eslint-disable-next-line guard-for-in
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    });
  },
});

export const selectSettings = (state: RootState) => state.settings;
export const selectSettingsLoaded = (state: RootState) => state.settings.loaded;

const selectColorScheme = (state: RootState) => state.settings.colorScheme;
const selectTheme = (state: RootState) => state.settings.theme;
const selectThemeMatchSystem = (state: RootState) =>
  state.settings.themeMatchSystem;
const selectThemeDark = (state: RootState) => state.settings.themeDark;
const selectThemeLight = (state: RootState) => state.settings.themeLight;
const selectAccentColor = (state: RootState) => state.settings.accentColor;
export const selectCurrentTheme = createSelector(
  [
    selectColorScheme,
    selectTheme,
    selectThemeMatchSystem,
    selectThemeDark,
    selectThemeLight,
  ],
  (colorScheme, theme, themeMatchSystem, themeDark, themeLight) =>
    themeMatchSystem
      ? colorScheme === "light"
        ? themeLight
        : themeDark
      : theme
);
export const selectThemeOptions = createSelector(
  [selectCurrentTheme],
  (theme) => ThemeOptionsMap[theme]
);
export const selectThemeConfig = createSelector(
  [selectThemeOptions, selectAccentColor],
  (themeOptions, accentColor) =>
    merge.all([
      GluestackTheme,
      {
        tokens: {
          colors: {
            ...themeOptions.colors,
          },
        },
      },
      accentColor
        ? {
            tokens: {
              colors: {
                app: {
                  accent: accentColor,
                },
              },
            },
          }
        : {},
    ]) as ICustomConfig
);
export default settingsSlice.reducer;
