import { createSlice } from "@reduxjs/toolkit";
import { CommunityBlockView, PersonBlockView } from "lemmy-js-client";
import { getSiteInfo, unblockCommunity } from "./siteActions";
import { RootState } from "../../store";

interface SiteState {
  communityBlocks: CommunityBlockView[];
  personBlocks: PersonBlockView[];
  loaded: boolean;
  error: boolean;
}

const initialState: SiteState = {
  communityBlocks: [],
  personBlocks: [],
  loaded: false,
  error: false,
};

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSiteInfo.fulfilled, (state, action) => {
      state.communityBlocks = action.payload.my_user.community_blocks;
      state.personBlocks = action.payload.my_user.person_blocks;
      state.loaded = true;
    });

    builder.addCase(unblockCommunity.fulfilled, (state, action) => {
      state.communityBlocks = state.communityBlocks.filter(
        (b) => b.community.id !== action.payload.community_view.community.id
      );
    });
  },
});

export const selectSite = (state: RootState) => state.site;

export default siteSlice.reducer;
