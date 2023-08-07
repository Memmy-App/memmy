import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetSiteResponse } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

export const getSiteInfo = createAsyncThunk(
  "site/getSiteInfo",
  async (_, thunkAPI) => {
    let tries = 0;
    let error;

    const get = async () => {
      try {
        tries += 1;

        return await lemmyInstance.getSite({
          auth: lemmyAuthToken,
        });
      } catch (e) {
        if (tries < 3) {
          return get();
        }

        handleLemmyError(e.toString());
        error = e.toString();
        return false;
      }
    };

    const res = await get();

    if (res === false) {
      return thunkAPI.rejectWithValue(error);
    }

    return res as GetSiteResponse;
  }
);

export const getUnreadCount = createAsyncThunk(
  "site/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      return await lemmyInstance.getUnreadCount({
        auth: lemmyAuthToken,
      });
    } catch (e) {
      handleLemmyError(e.toString());
      return thunkAPI.rejectWithValue(e.toString());
    }
  }
);

export const unblockCommunity = createAsyncThunk(
  "site/unblockCommunity",
  async (communityId: number, thunkAPI) => {
    try {
      return await lemmyInstance.blockCommunity({
        auth: lemmyAuthToken,
        community_id: communityId,
        block: false,
      });
    } catch (e) {
      handleLemmyError(e.toString());
      return thunkAPI.rejectWithValue(e.toString());
    }
  }
);
