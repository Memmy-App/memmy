import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Bookmark from "../../types/Bookmark";

export const loadBookmarks = createAsyncThunk(
    "bookmarks/loadBookmarks",
    async () => {
        const bookmarksStr = await AsyncStorage.getItem("@bookmarks");

        if(!bookmarksStr) return null;

        return JSON.parse(bookmarksStr) as Bookmark[];
    }
);

export const addBookmark = createAsyncThunk(
    "bookmarks/addBookmark",
    async (bookmark: Bookmark) => {
        const bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks")) as Bookmark[] ?? [];
        bookmarks.push(bookmark);
        await AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
        return bookmarks;
    }
);

export const removeBookmark = createAsyncThunk(
    "bookmarks/removeBookmark",
    async (postId: number) => {
        const bookmarks = JSON.parse(await AsyncStorage.getItem("@bookmarks")) as Bookmark[] ?? [];
        const index = bookmarks.findIndex((b) => b.postId === postId);
        bookmarks.splice(index, 1);
        await AsyncStorage.setItem("@accounts", JSON.stringify(bookmarks));
        return bookmarks;
    }
);