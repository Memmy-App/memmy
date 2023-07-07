import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetPost } from "lemmy-js-client";
import { lemmyInstance } from "../../LemmyInstance";
import { setPost } from "./postSlice";
import { writeToLog } from "../../helpers/LogHelper";

// eslint-disable-next-line import/prefer-default-export
export const getPost = createAsyncThunk(
  "post/getPost",
  async (data: GetPost, thunkAPI) => {
    try {
      const res = await lemmyInstance.getPost(data);

      thunkAPI.dispatch(setPost(res.post_view));
    } catch (e) {
      writeToLog("Error getting post.");
      writeToLog(e.toString());
      thunkAPI.rejectWithValue(e);
    }
  }
);
