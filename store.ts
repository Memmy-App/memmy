import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { postSlice } from "./slices/post/postSlice";
import { newCommentSlice } from "./slices/newComment/newCommentSlice";
import feedSlice from "./slices/feed/feedSlice";
import communitiesSlice from "./slices/communities/communitiesSlice";
import settingsSlice from "./slices/settings/settingsSlice";
import accountsSlice from "./slices/accounts/accountsSlice";
import bookmarksSlice from "./slices/bookmarks/bookmarksSlice";
import siteSlice from "./slices/site/siteSlice";
import toastSlice from "./slices/toast/toastSlice";

const store = configureStore({
  reducer: {
    post: postSlice.reducer,
    newComment: newCommentSlice.reducer,
    feed: feedSlice,
    communities: communitiesSlice,
    settings: settingsSlice,
    accounts: accountsSlice,
    bookmarks: bookmarksSlice,
    site: siteSlice,
    toast: toastSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
