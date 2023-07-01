import { createSlice } from "@reduxjs/toolkit";
import { ListingType, SortType } from "lemmy-js-client";
import { RootState } from "../../store";
import { loadSettings, setSetting } from "./settingsActions";
import { ThemeOptions } from "../../theme/themeOptions";
import { HapticOptions } from "../../types/haptics/hapticOptions";

export interface SettingsState {
  swipeGestures: boolean;
  displayImagesInFeed: string;
  defaultSort: SortType;
  defaultListingType: ListingType;
  showInstanceForUsernames: boolean;
  loaded: boolean;
  blurNsfw: boolean;
  hideNsfw: boolean;
  linkPreviews: boolean;
  compactView: boolean;
  theme: ThemeOptions;
  isSystemTextSize: boolean;
  fontSize: number;
  haptics: HapticOptions;
  pushEnabled: string;
  compactThumbnailPosition: "Left" | "Right";
  compactShowVotingButtons: boolean;
  markReadOnPostView: boolean;
  markReadOnPostImageView: boolean;
  markReadOnPostVote: boolean;
  ignoreScreenHeightInFeed: boolean;
}

const initialState: SettingsState = {
  swipeGestures: true,
  displayImagesInFeed: "true",
  defaultSort: "Hot",
  defaultListingType: "All",
  showInstanceForUsernames: false,
  loaded: false,
  blurNsfw: true,
  hideNsfw: true,
  linkPreviews: false,
  compactView: false,
  compactThumbnailPosition: "Left",
  compactShowVotingButtons: true,
  theme: "Dark",
  isSystemTextSize: true,
  fontSize: 2,
  haptics: "Medium",
  pushEnabled: "[]",
  markReadOnPostView: true,
  markReadOnPostImageView: true,
  markReadOnPostVote: true,
  ignoreScreenHeightInFeed: false,
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
