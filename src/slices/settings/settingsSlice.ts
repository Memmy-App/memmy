import { createSlice } from "@reduxjs/toolkit";
import { CommentSortType, ListingType, SortType } from "lemmy-js-client";
import { loadSettings, setSetting } from "@src/slices/settings/settingsActions";
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
export default settingsSlice.reducer;
