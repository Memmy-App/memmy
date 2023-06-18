import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetPost } from "lemmy-js-client";
import { lemmyInstance } from "../../lemmy/LemmyInstance";
import { setPost } from "./postSlice";

// eslint-disable-next-line import/prefer-default-export
export const getPost = createAsyncThunk(
  "post/getPost",
  async (data: GetPost, thunkAPI) => {
    try {
      const res = await lemmyInstance.getPost(data);

      thunkAPI.dispatch(setPost(res.post_view));
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);
