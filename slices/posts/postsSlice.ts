import {PostView, SortType} from "lemmy-js-client";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {getPosts} from "./postsActions";

interface PostsState {
    posts: PostView[]|null,
    loading: boolean,
    error: boolean,
    sort: SortType
}

interface SetPostsVoteOptions {
    postId: number,
    vote: 1|0|-1
}

const initialState: PostsState = {
    posts: null,
    loading: false,
    error: false,
    sort: "Hot"
};

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state: PostsState, action: PayloadAction<PostView[]>) => {
            state.posts = action.payload;
        },

        setSort: (state: PostsState, action: PayloadAction<SortType>) => {
            state.sort = action.payload;
        },

        setLoading: (state: PostsState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setPostsVote: (state: PostsState, action: PayloadAction<SetPostsVoteOptions>) => {
            state.posts = state.posts.map((p) => {
                if(p.post.id !== action.payload.postId) return p;

                return {
                    ...p,
                    my_vote: action.payload.vote
                };
            });
        },

        clearPosts: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(getPosts.pending, (state: PostsState) => {
            state.loading = true;
            state.error = false;
        });

        builder.addCase(getPosts.rejected, (state: PostsState) => {
            state.loading = false;
            state.error = true;
        });

        builder.addCase(getPosts.fulfilled, (state: PostsState) => {
            state.loading = false;
            state.error = false;
        });
    }
});

export const selectPosts = (state: RootState) => state.posts;

export const {setPosts, setSort, setLoading, setPostsVote, clearPosts} = postsSlice.actions;
export default postsSlice.reducer;