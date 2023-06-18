import { createAsyncThunk } from "@reduxjs/toolkit";
import { ListingType } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../lemmy/LemmyInstance";

export const getAllCommunities = createAsyncThunk(
  "communities/getAllCommunities",
  async (_, thunkAPI) => {
    try {
      const res = await lemmyInstance.listCommunities({
        auth: lemmyAuthToken,
        type_: ListingType.All,
        limit: 50,
      });

      return res.communities;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getLocalCommunities = () => {};

export const getSubscribedCommunities = createAsyncThunk(
  "communities/getSubscribedCommunities",
  async (_, thunkAPI) => {
    try {
      const res = await lemmyInstance.listCommunities({
        auth: lemmyAuthToken,
        type_: ListingType.Subscribed,
        limit: 50,
      });

      return res.communities.sort((a, b) =>
        a.community.name.localeCompare(b.community.name)
      );
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

interface SubscribeToCommunityOptions {
  communityId: number;
  subscribe: boolean;
}

export const subscribeToCommunity = createAsyncThunk(
  "communities/subscribeToCommunity",
  async (data: SubscribeToCommunityOptions, thunkAPI) => {
    try {
      await lemmyInstance.followCommunity({
        auth: lemmyAuthToken,
        community_id: data.communityId,
        follow: data.subscribe,
      });

      thunkAPI.dispatch(getSubscribedCommunities());
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);
