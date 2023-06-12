import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetPosts} from "lemmy-js-client";
import {lemmyInstance} from "../../lemmy/LemmyInstance";
import {setPosts} from "./postsSlice";

export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async (data: GetPosts, thunkAPI) => {
        try {
            const res = await lemmyInstance.getPosts(data);

            thunkAPI.dispatch(setPosts(res.posts));
        } catch(e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);
