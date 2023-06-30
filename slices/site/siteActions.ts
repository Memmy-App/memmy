import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetSiteResponse } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../lemmy/LemmyInstance";
import { writeToLog } from "../../helpers/LogHelper";

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
        writeToLog("Error getting site info.");
        writeToLog(e.toString());

        if (tries < 3) {
          return get();
        }

        error = e.toString();
        return false;
      }
    };

    const res = get();

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
      const res = await lemmyInstance.getUnreadCount({
        auth: lemmyAuthToken,
      });

      return res;
    } catch (e) {
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
      return await lemmyInstance.blockCommunity({
        auth: lemmyAuthToken,
        community_id: communityId,
        block: false,
      });
    } catch (e) {
      writeToLog("Error unblocking traverse.");
      writeToLog(e.toString());
      return thunkAPI.rejectWithValue(e.toString());
    }
  }
);
