import { createSlice } from "@reduxjs/toolkit";
import { CommentSortType, ListingType, SortType } from "lemmy-js-client";
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
  theme: ThemeOptions;
  themeLight: ThemeOptions;
  themeDark: ThemeOptions;
  themeMatchSystem: boolean;
  isSystemFont: boolean;
  isSystemTextSize: boolean;
  fontSize: number;
  fontWeightPostTitle: number;
  haptics: HapticOptions;
  pushEnabled: string;
  compactThumbnailPosition: "None" | "Left" | "Right";
  compactShowVotingButtons: boolean;
  markReadOnPostView: boolean;
  markReadOnPostImageView: boolean;
  markReadOnPostVote: boolean;
  ignoreScreenHeightInFeed: boolean;
  displayTotalScore: boolean;
  useReaderMode: boolean;
  accentColor?: string;
  hideReadPostsOnFeed: boolean;
  showHideReadButton: boolean;
  appIcon: string;
  showCommentActions: boolean;
  useDefaultBrowser: boolean;
  tapToCollapse: boolean;
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
  theme: "Dark",
  themeLight: "Light",
  themeDark: "Dark",
  themeMatchSystem: false,
  isSystemFont: false,
  isSystemTextSize: true,
  fontSize: 2,
  fontWeightPostTitle: 400,
  haptics: "Medium",
  pushEnabled: "[]",
  markReadOnPostView: true,
  markReadOnPostImageView: true,
  markReadOnPostVote: true,
  ignoreScreenHeightInFeed: false,
  displayTotalScore: true,
  useReaderMode: false,
  hideReadPostsOnFeed: false,
  showHideReadButton: false,
  appIcon: "purple",
  showCommentActions: true,
  useDefaultBrowser: false,
  tapToCollapse: true,
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
export default settingsSlice.reducer;
