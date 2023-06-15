import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Setting} from "./settingsSlice";
import Bookmark from "../../types/Bookmark";
import {Settings} from "react-native";

export const loadSettings = createAsyncThunk(
    "settings/loadSettings",
    async () => {
        const settingsStr = await AsyncStorage.getItem("settings");

        const x = JSON.parse(settingsStr) as Settings;
        console.log(x);
        return x;
    }
);

export const setSetting = createAsyncThunk(
    "settings/setSetting",
    async (setting: Setting, thunkAPI) => {
        const state = thunkAPI.getState();
        const settings = state.settings.settings;

        settings[setting.key] = setting.value;

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
            value: [...state.settings.settings.bookmarks, bookmark]
        }));

        return bookmark;
    }
);

export const removeBookmark = createAsyncThunk(
    "settings/removeBookmark",
    async (postId: number, thunkAPI) => {
        const state = thunkAPI.getState();
        const bookmarks = state.settings.settings.bookmarks.filter((b) => b.postId !== postId);

        thunkAPI.dispatch(setSetting({
            key: "bookmarks",
            value: bookmarks
        }));

        return bookmarks;
    }
);