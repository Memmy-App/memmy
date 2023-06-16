import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {addAccount, addBookmark, loadSettings, removeBookmark, setAccount, setSetting} from "./settingsActions";
import {ListingType, SortType} from "lemmy-js-client";
import Bookmark from "../../types/Bookmark";

export interface SettingsState {
    accounts: Account[]
    swipeGestures: boolean,
    displayImagesInFeed: string,
    defaultSort: SortType,
    defaultListingType: ListingType,
    bookmarks: Bookmark[],
    loaded: boolean
}

export interface Account {
    username: string,
    password: string,
    instance: string,
    token: string
}

const initialState: SettingsState = {
    accounts: [],
    swipeGestures: true,
    displayImagesInFeed: "true",
    defaultSort: "Hot",
    defaultListingType: "All",
    bookmarks: [],
    loaded: false
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            if(action.payload) {
                for(const key in action.payload) {
                    state[key] = action.payload[key];
                }
            }

            state.loaded = true;
        });

        builder.addCase(setSetting.fulfilled, (state, action) => {
            for(const key in action.payload) {
                state[key] = action.payload[key];
            }
        });

        builder.addCase(addBookmark.fulfilled, (state, action) => {
            console.log("payload: ", action.payload);

            state.bookmarks = [
                ...state.bookmarks,
                action.payload
            ];
        });

        builder.addCase(removeBookmark.fulfilled, (state, action) => {
            state.bookmarks = action.payload;
        });

        builder.addCase(addAccount.fulfilled, (state, action) => {
            state.accounts = [
                ...state.accounts,
                action.payload
            ];
        });

        builder.addCase(setAccount.fulfilled, (state, action) => {
            state.accounts = action.payload;
        });
    }
});

export const selectSettings = (state: RootState) => state.settings;
export const selectSettingsLoaded = (state: RootState) => state.settings.loaded;
export default settingsSlice.reducer;