import {configureStore} from "@reduxjs/toolkit";
import {postSlice} from "./slices/post/postSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {newCommentSlice} from "./slices/newComment/newCommentSlice";
import feedSlice from "./slices/feed/feedSlice";
import communitiesSlice from "./slices/communities/communitiesSlice";
import settingsSlice from "./slices/settings/settingsSlice";

const store = configureStore({
    reducer: {
        post: postSlice.reducer,
        newComment: newCommentSlice.reducer,
        feed: feedSlice,
        communities: communitiesSlice,
        settings: settingsSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;