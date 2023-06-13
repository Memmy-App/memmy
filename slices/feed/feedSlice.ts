import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";

interface FeedState {
    category: Category,
    dropdownVisible: boolean,
}

interface Category {
    name: string,
    type: "category" | "global" | "subscriptions"
}

const initialState: FeedState = {
    category: {
        name: "Hot",
        type: "global"
    },
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
        }
    }
});

export const selectFeed = (state: RootState) => state.feed;

export const {setDropdownVisible, setCategory} = feedSlice.actions;
export default feedSlice.reducer;