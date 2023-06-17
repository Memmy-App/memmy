import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetSiteResponse} from "lemmy-js-client";

export const getSiteInfo = createAsyncThunk(
    "site/getSiteInfo",
    async (_, thunkAPI) => {
        let tries = 0;
        let error;

        const get = async () => {
            try {
                tries++;

                return await lemmyInstance.getSite({
                    auth: lemmyAuthToken
                });
            } catch(e) {
                if(tries < 3) {
                    return get();
                }

                error = e.toString();
                return false;
            }
        };

        const res = get();

        if(res === false) {
            return thunkAPI.rejectWithValue(error);
        }

        return res as GetSiteResponse;
    }
);

export const unblockCommunity = createAsyncThunk(
    "site/unblockCommunity",
    async (communityId: number, thunkAPI) => {
        try {
            return await lemmyInstance.blockCommunity({
                auth: lemmyAuthToken,
                community_id: communityId,
                block: false
            });
        } catch(e) {
            return thunkAPI.rejectWithValue(e.toString());
        }
    }
);