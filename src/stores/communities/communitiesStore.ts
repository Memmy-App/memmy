import { CommunityView } from "lemmy-js-client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CommunitiesStore {
  communityStates: Map<string, CommunityState>;
}

interface CommunityState {
  community: CommunityView;

  status: {
    loading: boolean;
    error: boolean;
    refreshing: boolean;
  };
}

export const useCommunitiesStore = create(
  immer<CommunitiesStore>(() => ({
    communityStates: new Map<string, CommunityState>(),
  }))
);

export const useCommunity = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName).community
  );
export const useCommunityStatus = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName).status
  );
