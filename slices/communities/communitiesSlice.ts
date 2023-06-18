import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommunityView } from "lemmy-js-client";
import { RootState } from "../../store";
import {
  getAllCommunities,
  getSubscribedCommunities,
} from "./communitiesActions";

interface CommunitiesState {
  allCommunities: CommunityView[];
  subscribedCommunities: CommunityView[];
  localCommunities: CommunityView[];
  loading: boolean;
  error: boolean;
}

const initialState: CommunitiesState = {
  allCommunities: [],
  subscribedCommunities: [],
  localCommunities: [],
  loading: false,
  error: false,
};

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    setAllCommunities: (
      state: CommunitiesState,
      actions: PayloadAction<CommunityView[]>
    ) => {
      state.allCommunities = actions.payload;
    },
    setSubscribedCommunities: (
      state: CommunitiesState,
      actions: PayloadAction<CommunityView[]>
    ) => {
      state.subscribedCommunities = actions.payload;
    },
    setLocalCommunities: (
      state: CommunitiesState,
      actions: PayloadAction<CommunityView[]>
    ) => {
      state.localCommunities = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getSubscribedCommunities.fulfilled,
      (state: CommunitiesState, actions) => {
        state.subscribedCommunities = actions.payload;
      }
    );

    builder.addCase(
      getAllCommunities.fulfilled,
      (state: CommunitiesState, actions) => {
        state.allCommunities = actions.payload;
      }
    );
  },
});

export const selectCommunities = (state: RootState) => state.communities;

export const {
  setAllCommunities,
  setSubscribedCommunities,
  setLocalCommunities,
} = communitiesSlice.actions;
export default communitiesSlice.reducer;
