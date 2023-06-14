import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {ListingType} from "lemmy-js-client";

interface FeedState {
    dropdownVisible: boolean,
    updateVote: UpdateVote|null,
    listingType: ListingType,
}

interface UpdateVote {
    postId: number,
    vote: -1 | 0 | 1
}

const initialState: FeedState = {
    updateVote: null,
    dropdownVisible: false,
    listingType: "All",
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

        setFeedListingType: (state: FeedState, actions: PayloadAction<ListingType>) => {
            state.listingType = actions.payload;
        },

        clearUpdateVote: (state: FeedState) => {
            state.updateVote = null;
        },
    }
});

export const selectFeed = (state: RootState) => state.feed;

export const {
    setDropdownVisible,
    setUpdateVote,
    clearUpdateVote,
    setFeedListingType,
} = feedSlice.actions;
export default feedSlice.reducer;