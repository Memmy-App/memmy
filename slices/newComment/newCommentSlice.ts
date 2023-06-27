import { CommentView, PostView } from "lemmy-js-client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface NewCommentState {
  responseTo: ResponseTo | null;
  newComment?: CommentView;
}

export interface ResponseTo {
  post?: PostView;
  comment?: CommentView;
  languageId: number;
}

const initialState: NewCommentState = {
  responseTo: null,
  newComment: null,
};

export const newCommentSlice = createSlice({
  name: "newComment",
  initialState,
  reducers: {
    setResponseTo: (
      state: NewCommentState,
      action: PayloadAction<ResponseTo>
    ) => {
      state.responseTo = action.payload;
    },

    clearNewComment: () => initialState,
  },
});

export const selectNewComment = (state: RootState) => state.newComment;

export const { setResponseTo, clearNewComment } = newCommentSlice.actions;
export default newCommentSlice.reducer;
