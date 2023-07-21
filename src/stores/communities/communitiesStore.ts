import { CommunityModeratorView, CommunityView } from "lemmy-js-client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CommunitiesStore {
  communityStates: Map<string, CommunityState>;
}

interface CommunityState {
  community: CommunityView | null;
  moderators: CommunityModeratorView[];
  languages: number[];

  status: {
    loading: boolean;
    error: boolean;
    refreshing: boolean;
    notFound: boolean;
  };
}

export const useCommunitiesStore = create(
  immer<CommunitiesStore>(() => ({
    communityStates: new Map<string, CommunityState>(),
  }))
);

export const useCommunity = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.community
  );
export const useCommunityModerators = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.moderators
  );

export const useCommunityLanguages = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.languages
  );
export const useCommunityStatus = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.status
  );
