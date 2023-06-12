import {CommentView, PostView} from "lemmy-js-client";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";

interface PostState {
    post: PostView|null,
    newComment: PostNewComment
}

export interface PostNewComment {
    comment: CommentView,
    isTopComment: boolean
}

const initialState: PostState ={
    post: null,
    newComment: null
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPost: (state: PostState, action: PayloadAction<PostView>) => {
            state.post = action.payload;
            state.newComment = null;
        },

        setPostNewComment: (state: PostState, action: PayloadAction<PostNewComment>) => {
            state.newComment = action.payload;
        }
    }
});

export const selectPost = (state: RootState) => state.post;

export const {setPost, setPostNewComment} = postSlice.actions;
export default postSlice.reducer;