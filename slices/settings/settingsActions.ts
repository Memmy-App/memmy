import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Account, SettingsState} from "./settingsSlice";
import Bookmark from "../../types/Bookmark";

export const loadSettings = createAsyncThunk(
    "settings/loadSettings",
    async () => {
        const settingsStr = await AsyncStorage.getItem("settings");

        if(!settingsStr) {
            return null;
        }

        return JSON.parse(settingsStr) as SettingsState;
    }
);

export const setSetting = createAsyncThunk(
    "settings/setSetting",
    async (setting: object, thunkAPI) => {
        const state = thunkAPI.getState();
        const settings = {
            ...state.settings,
            ...setting
        };

        await AsyncStorage.setItem("settings", JSON.stringify(settings));

        return setting;
    }
);

export const addBookmark = createAsyncThunk(
    "settings/addBookmark",
    async (bookmark: Bookmark, thunkAPI) => {
        const state = thunkAPI.getState();

        thunkAPI.dispatch(setSetting({
            key: "bookmarks",
            value: [...state.settings.bookmarks, bookmark]
        }));

        return bookmark;
    }
);

export const removeBookmark = createAsyncThunk(
    "settings/removeBookmark",
    async (postId: number, thunkAPI) => {
        const state = thunkAPI.getState();
        const bookmarks = state.settings.bookmarks.filter((b) => b.postId !== postId);

        thunkAPI.dispatch(setSetting({
            key: "bookmarks",
            value: bookmarks
        }));

        return bookmarks;
    }
);

export const addAccount = createAsyncThunk(
    "settings/addAccount",
    async (account: Account, thunkAPI) => {
        const state = thunkAPI.getState();

        const accounts = [...state.settings.accounts, account];

        console.log(accounts);

        thunkAPI.dispatch(setSetting({
            key: "accounts",
            value: accounts
        }));

        return account;
    }
);

export const setAccount = createAsyncThunk(
    "settings/setAccount",
    async (account: Account, thunkAPI) => {
        const state = thunkAPI.getState();

        const accounts = state.settings.accounts.map((a) => {
            if(a.username === account.username && a.instance === account.instance) {
                return account;
            }

            return a;
        });

        thunkAPI.dispatch(setSetting({
            key: "accounts",
            value: accounts
        }));

        return accounts;
    }
);