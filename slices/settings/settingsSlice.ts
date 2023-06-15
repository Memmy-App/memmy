import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {loadSettings, removeBookmark, setSetting} from "./settingsActions";
import {ListingType, SortType} from "lemmy-js-client";
import Bookmark from "../../types/Bookmark";

interface SettingsState {
    settings: Settings
}
interface Settings {
    swipeGestures: string,
    displayImagesInFeed: string,
    defaultSort: SortType,
    defaultListingType: ListingType,
    bookmarks: Bookmark[]
}

export interface Setting {
    key: string,
    value: string
}

const initialState: SettingsState = {
    settings: {
        swipeGestures: "true",
        displayImagesInFeed: "true",
        defaultSort: "Hot",
        defaultListingType: "All",
        bookmarks: []
    }
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state: SettingsState, action: PayloadAction<Setting[]>) => {
            for(const setting of action.payload) {
                state.settings = {
                    ...state.settings,
                    [setting.key]: setting.value
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            for(const setting of action.payload) {
                state.settings = {
                    ...state.settings,
                    [setting.key]: setting.value
                };
            }
        });

        builder.addCase(setSetting.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                [action.payload.key]: action.payload.value
            };
        });

        builder.addCase(removeBookmark.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                bookmarks: action.payload
            };
        });
    }
});

export const selectSettings = (state: RootState) => state.settings.settings;

export const {setSettings} = settingsSlice.actions;
export default settingsSlice.reducer;
