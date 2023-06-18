import { createSlice } from "@reduxjs/toolkit";
import { addBookmark, loadBookmarks, removeBookmark } from "./bookmarksActions";
import Bookmark from "../../types/Bookmark";

interface BookmarksState {
  bookmarks: Bookmark[];
}

const initialState: BookmarksState = {
  bookmarks: [],
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadBookmarks.fulfilled, (state, action) => {
      if (action.payload) state.bookmarks = action.payload;
    });
    builder.addCase(addBookmark.fulfilled, (state, action) => {
      if (action.payload) state.bookmarks = action.payload;
    });
    builder.addCase(removeBookmark.fulfilled, (state, action) => {
      if (action.payload) state.bookmarks = action.payload;
    });
  },
});

export const selectBookmarks = (state) => state.bookmarks.bookmarks;

export default bookmarksSlice.reducer;
