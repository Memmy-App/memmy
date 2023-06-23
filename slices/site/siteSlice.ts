import { createSlice } from "@reduxjs/toolkit";
import { CommunityBlockView, PersonBlockView } from "lemmy-js-client";
import { getSiteInfo, getUnreadCount, unblockCommunity } from "./siteActions";
import { RootState } from "../../store";

interface SiteState {
  communityBlocks: CommunityBlockView[];
  personBlocks: PersonBlockView[];
  loaded: boolean;
  error: boolean;
  unread: {
    mentions: number;
    privateMessage: number;
    replies: number;
  };
}

const initialState: SiteState = {
  communityBlocks: [],
  personBlocks: [],
  loaded: false,
  error: false,
  unread: {
    mentions: 0,
    privateMessage: 0,
    replies: 0,
  },
};

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setUnread: (state, action) => {
      state.unread = {
        ...state.unread,
        [action.payload.type]: action.payload.amount,
      };
    },
  },
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

    builder.addCase(getUnreadCount.fulfilled, (state, action) => {
      state.unread = {
        ...state.unread,
        mentions: action.payload.mentions,
        privateMessage: action.payload.private_messages,
        replies: action.payload.replies,
      };
    });
  },
});

export const selectSite = (state: RootState) => state.site;

export default siteSlice.reducer;
