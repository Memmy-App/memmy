import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface EditCommentState {
  commentId: number;
  content: string;
  languageId: number;
}

export interface EditCommentAction {
  commentId: number;
  content: string;
  languageId: number;
}

const initialState: EditCommentState = {
  commentId: 0,
  content: "",
  languageId: 0,
};

export const editCommentSlice = createSlice({
  name: "editComment",
  initialState,
  reducers: {
    editComment: (
      state: EditCommentState,
      action: PayloadAction<EditCommentAction>
    ) => {
      state.commentId = action.payload.commentId;
      state.content = action.payload.content;
      state.languageId = action.payload.languageId;
    },

    // clearNewComment: () => initialState,
  },
});

export const selectEditComment = (state: RootState) => state.editComment;

export const { editComment } = editCommentSlice.actions;
export default editCommentSlice.reducer;
