import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface EditCommentState {
  commentId: number;
  content: string;
}

const initialState: EditCommentState = {
  commentId: 0,
  content: "",
};

export const editCommentSlice = createSlice({
  name: "editComment",
  initialState,
  reducers: {
    setEditComment: (
      state: EditCommentState,
      action: PayloadAction<EditCommentState>
    ) => {
      state.commentId = action.payload.commentId;
      state.content = action.payload.content;
    },

    clearEditComment: () => initialState,
  },
});

export const selectEditComment = (state: RootState) => state.editComment;

export const { setEditComment } = editCommentSlice.actions;
export default editCommentSlice.reducer;
