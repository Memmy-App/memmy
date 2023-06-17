import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetSiteResponse, MyUserInfo} from "lemmy-js-client";
import {getSiteInfo} from "./siteActions";
import {RootState} from "../../store";

interface SiteState {
    myUser: MyUserInfo,
    loaded: boolean,
    error: boolean,
}

const initialState = {
    myUser: null,
    loaded: false,
    error: false
};

const siteSlice = createSlice({
    name: "site",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getSiteInfo.fulfilled, (state, action) => {
            state.myUser = action.payload.my_user;
        });
    }
});

export const selectSite = (state: RootState) => state.site;

export default siteSlice.reducer;