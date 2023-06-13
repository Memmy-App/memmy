import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetPosts} from "lemmy-js-client";
import {lemmyInstance} from "../../lemmy/LemmyInstance";

export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (data: GetPosts, thunkAPI) => {
        try {
            const res = await lemmyInstance.getPosts(data);

            return res.posts;
        } catch(e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);
