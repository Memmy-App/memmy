import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListingType } from "lemmy-js-client";
import { RootState } from "../../store";

interface FeedState {
  dropdownVisible: boolean;
  updateVote: UpdateVote | null;
  listingType: ListingType;
  updateSaved: number | null;
}

interface UpdateVote {
  postId: number;
  vote: -1 | 0 | 1;
}

const initialState: FeedState = {
  updateVote: null,
  dropdownVisible: false,
  listingType: "All",
  updateSaved: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setDropdownVisible: (state: FeedState) => {
      state.dropdownVisible = !state.dropdownVisible;
    },

    setUpdateVote: (state: FeedState, actions: PayloadAction<UpdateVote>) => {
      state.updateVote = actions.payload;
    },

    setUpdateSaved: (state: FeedState, actions: PayloadAction<number>) => {
      state.updateSaved = actions.payload;
    },

    clearUpdateSaved: (state: FeedState) => {
      state.updateSaved = null;
    },

    setFeedListingType: (
      state: FeedState,
      actions: PayloadAction<ListingType>
    ) => {
      state.listingType = actions.payload;
    },

    clearUpdateVote: (state: FeedState) => {
      state.updateVote = null;
    },
  },
});

export const selectFeed = (state: RootState) => state.feed;

export const {
  setDropdownVisible,
  setUpdateVote,
  clearUpdateVote,
  setFeedListingType,
  setUpdateSaved,
  clearUpdateSaved,
} = feedSlice.actions;
export default feedSlice.reducer;
