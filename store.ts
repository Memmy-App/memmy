import {configureStore} from "@reduxjs/toolkit";
import {postSlice} from "./slices/post/postSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {newCommentSlice} from "./slices/newComment/newCommentSlice";

const store = configureStore({
    reducer: {
        post: postSlice.reducer,
        newComment: newCommentSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;