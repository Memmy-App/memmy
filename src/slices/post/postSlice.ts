import { CommentView, PostView } from "lemmy-js-client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { getPost } from "./postActions";

interface PostState {
  post: PostView | null;
  newComment: PostNewComment;
  loading: boolean;
  error: boolean;
}

export interface PostNewComment {
  comment: CommentView;
  isTopComment: boolean;
}

const initialState: PostState = {
  post: null,
  newComment: null,
  loading: false,
  error: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state: PostState, action: PayloadAction<PostView>) => {
      state.post = action.payload;
      state.newComment = null;
    },

    setPostNewComment: (
      state: PostState,
      action: PayloadAction<PostNewComment>
    ) => {
      state.newComment = action.payload;
    },

    setPostVote: (state: PostState, action: PayloadAction<1 | 0 | -1>) => {
      state.post = {
        ...state.post,
        my_vote: action.payload,
      };
    },

    setPostSaved: (state: PostState, action: PayloadAction<boolean>) => {
      state.post = {
        ...state.post,
        saved: action.payload,
      };
    },

    clearPost: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getPost.pending, (state: PostState) => {
      state.loading = true;
      state.error = false;
    });

    builder.addCase(getPost.rejected, (state: PostState) => {
      state.loading = false;
      state.error = true;
    });

    builder.addCase(getPost.fulfilled, (state: PostState) => {
      state.loading = false;
      state.error = false;
    });
  },
});

export const selectPost = (state: RootState) => state.post;

export const {
  setPost,
  setPostNewComment,
  setPostVote,
  setPostSaved,
  clearPost,
} = postSlice.actions;
export default postSlice.reducer;
