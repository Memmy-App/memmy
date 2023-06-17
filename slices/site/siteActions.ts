import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetSiteResponse} from "lemmy-js-client";
import {RejectedWithValueActionFromAsyncThunk} from "@reduxjs/toolkit/dist/matchers";

export const getSiteInfo = createAsyncThunk(
    "site/getSiteInfo",
    async (_, thunkAPI) => {
        let tries = 0;
        let error;

        const get = async () => {
            try {
                tries++;

                const res = await lemmyInstance.getSite({
                    auth: lemmyAuthToken
                });

                return res;
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