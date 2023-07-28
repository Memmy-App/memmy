import { CommunityModeratorView, CommunityView } from "lemmy-js-client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useAccountStore } from "@src/stores/account/accountStore";
import { getBaseUrl } from "@src/helpers/LinkHelper";

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

export const useIsCommunityModerator = (communityName: string) =>
  useCommunitiesStore((state) => {
    const { currentAccount } = useAccountStore.getState();

    return (
      state.communityStates
        .get(communityName)
        .moderators.findIndex(
          (m) =>
            m.moderator.name === currentAccount.username &&
            getBaseUrl(m.moderator.actor_id) === currentAccount.instance
        ) > -1
    );
  });

export const useCommunityLanguages = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.languages
  );
export const useCommunityStatus = (communityName: string) =>
  useCommunitiesStore(
    (state) => state.communityStates.get(communityName)?.status
  );
