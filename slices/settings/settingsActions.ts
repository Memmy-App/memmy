import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Setting} from "./settingsSlice";
import Bookmark from "../../types/Bookmark";

export const loadSettings = createAsyncThunk(
    "settings/loadSettings",
    async () => {
        const keys = await AsyncStorage.getAllKeys();

        const settings: Setting[] = [];

        for(const key of keys) {
            settings.push({
                key,
                value: await AsyncStorage.getItem(key)
            });
        }

        return settings;
    }
);

export const setSetting = createAsyncThunk(
    "settings/setSetting",
    async (setting: Setting) => {
        await AsyncStorage.setItem(setting.key, setting.value);
        return setting;
    }
);

export const addBookmark = createAsyncThunk(
    "settings/addBookmark",
    async (bookmark: Bookmark) => {
        const bookmarks = JSON.parse(await AsyncStorage.getItem("bookmarks")) as Bookmark[];

        await AsyncStorage.setItem("bookmarks", JSON.stringify([...bookmarks, bookmark]));
    }
);

export const removeBookmark = createAsyncThunk(
    "settings/removeBookmark",
    async (postId: number) => {
        const bookmarks = JSON.parse(await AsyncStorage.getItem("bookmarks")) as Bookmark[];

        return bookmarks.filter((b) => b.postId !== postId);
    }
);