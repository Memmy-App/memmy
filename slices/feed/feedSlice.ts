import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";

interface FeedState {
    category: Category,
    dropdownVisible: boolean,
    updateVote: UpdateVote|null,
}

interface Category {
    name: string,
    type: "category" | "global" | "subscriptions"
}

interface UpdateVote {
    postId: number,
    vote: -1 | 0 | 1
}

const initialState: FeedState = {
    category: {
        name: "Hot",
        type: "global"
    },
    updateVote: null,
    dropdownVisible: false
};

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        setDropdownVisible: (state: FeedState) => {
            state.dropdownVisible = !state.dropdownVisible;
        },

        setCategory: (state: FeedState, actions: PayloadAction<Category>) => {
            state.category = actions.payload;
        },

        setUpdateVote: (state: FeedState, actions: PayloadAction<UpdateVote>) => {
            state.updateVote = actions.payload;
        },

        clearUpdateVote: (state: FeedState) => {
            state.updateVote = null;
        }
    }
});

export const selectFeed = (state: RootState) => state.feed;

export const {
    setDropdownVisible,
    setCategory,
    setUpdateVote,
    clearUpdateVote
} = feedSlice.actions;
export default feedSlice.reducer;