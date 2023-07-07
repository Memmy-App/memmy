import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { postSlice } from "./src/slices/post/postSlice";
import { newCommentSlice } from "./src/slices/comments/newCommentSlice";
import feedSlice from "./src/slices/feed/feedSlice";
import settingsSlice from "./src/slices/settings/settingsSlice";
import accountsSlice from "./src/slices/accounts/accountsSlice";
import siteSlice from "./src/slices/site/siteSlice";
import toastSlice from "./src/slices/toast/toastSlice";
import editCommentSlice from "./src/slices/comments/editCommentSlice";

const store = configureStore({
  reducer: {
    post: postSlice.reducer,
    newComment: newCommentSlice.reducer,
    feed: feedSlice,
    settings: settingsSlice,
    accounts: accountsSlice,
    site: siteSlice,
    toast: toastSlice,
    editComment: editCommentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
