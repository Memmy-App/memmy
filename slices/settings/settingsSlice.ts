import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {addAccount, addBookmark, loadSettings, removeBookmark, setAccount, setSetting} from "./settingsActions";
import {ListingType, SortType} from "lemmy-js-client";
import Bookmark from "../../types/Bookmark";

export interface SettingsState {
    settings: Settings,
    loaded: boolean,
}
export interface Settings {
    accounts: Account[]
    swipeGestures: string,
    displayImagesInFeed: string,
    defaultSort: SortType,
    defaultListingType: ListingType,
    bookmarks: Bookmark[]
}

export interface Account {
    username: string,
    password: string,
    instance: string,
    token: string
}

export interface Setting {
    key: string,
    value: any
}

const initialState: SettingsState = {
    settings: {
        accounts: [],
        swipeGestures: "true",
        displayImagesInFeed: "true",
        defaultSort: "Hot",
        defaultListingType: "All",
        bookmarks: []
    },
    loaded: false
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state: SettingsState, action: PayloadAction<Setting[]>) => {
            for (const setting of action.payload) {
                state.settings = {
                    ...state.settings,
                    [setting.key]: setting.value
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            if(action.payload !== null) {
                console.log(action.payload);
                state.settings = {
                    ...state.settings,
                    ...action.payload
                };

                state.loaded = true;
            }
        });

        builder.addCase(setSetting.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                [action.payload.key]: action.payload.value
            };
        });

        builder.addCase(addBookmark.fulfilled, (state, action) => {
            console.log("payload: ", action.payload);

            state.settings = {
                ...state.settings,
                bookmarks: [
                    ...state.settings.bookmarks,
                    action.payload
                ]
            };
        });

        builder.addCase(removeBookmark.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                bookmarks: action.payload
            };
        });

        builder.addCase(addAccount.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                accounts: [
                    ...state.settings.accounts,
                    action.payload
                ]
            };
        });

        builder.addCase(setAccount.fulfilled, (state, action) => {
            state.settings = {
                ...state.settings,
                accounts: action.payload
            };
        });
    }
});

export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSettingsLoaded = (state: RootState) => state.settings.loaded;

export const {setSettings} = settingsSlice.actions;
export default settingsSlice.reducer;