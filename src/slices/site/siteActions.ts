import { createAsyncThunk } from "@reduxjs/toolkit";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";

export const getSiteInfo = createAsyncThunk(
  "site/getSiteInfo",
  async (_, thunkAPI) => {
    try {
      const res = await lemmyInstance!.getSite({
        auth: lemmyAuthToken,
      });

      return res;
    } catch (e: any) {
      writeToLog("Error getting site info.");
      writeToLog(e.toString());

      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "site/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      return await lemmyInstance!.getUnreadCount({
        auth: lemmyAuthToken!,
      });
    } catch (e: any) {
      writeToLog("Error getting unread count.");
      writeToLog(e.toString());
      return thunkAPI.rejectWithValue(e.toString());
    }
  }
);

export const unblockCommunity = createAsyncThunk(
  "site/unblockCommunity",
  async (communityId: number, thunkAPI) => {
    try {
      return await lemmyInstance!.blockCommunity({
        auth: lemmyAuthToken!,
        community_id: communityId,
        block: false,
      });
    } catch (e: any) {
      writeToLog("Error unblocking Traverse.");
      writeToLog(e.toString());
      return thunkAPI.rejectWithValue(e.toString());
    }
  }
);
