import { CommunityModeratorView, CommunityView } from "lemmy-js-client";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { useAccountStore } from "@src/state/account/accountStore";
import { getBaseUrl } from "@src/helpers/links";

interface CommunityStore {
  communityStates: Map<string, CommunityState>;
}

interface CommunityStatus {
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  notFound: boolean;
}

interface CommunityState {
  community: CommunityView | undefined;
  moderators: CommunityModeratorView[];
  languages: number[];

  status: CommunityStatus;
}

export const useCommunityStore = create(
  immer<CommunityStore>(() => ({
    communityStates: new Map<string, CommunityState>(),
  }))
);

export const useCommunity = (
  communityName: string
): CommunityView | undefined =>
  useCommunityStore(
    (state) => state.communityStates.get(communityName)?.community
  );
export const useCommunityModerators = (
  communityName: string
): CommunityModeratorView[] | undefined =>
  useCommunityStore(
    (state) => state.communityStates.get(communityName)?.moderators
  );

export const useIsCommunityModerator = (
  communityName: string
): boolean | undefined =>
  useCommunityStore((state) => {
    const { currentAccount } = useAccountStore.getState();

    const moderators = state.communityStates.get(communityName)?.moderators;

    return (
      moderators &&
      moderators.findIndex(
        (m) =>
          m.moderator.name === currentAccount?.username &&
          getBaseUrl(m.moderator.actor_id) === currentAccount?.host
      ) > -1
    );
  });

export const useCommunityLanguages = (
  communityName: string
): number[] | undefined =>
  useCommunityStore(
    (state) => state.communityStates.get(communityName)?.languages
  );
export const useCommunityStatus = (
  communityName: string
): CommunityStatus | undefined =>
  useCommunityStore(
    (state) => state.communityStates.get(communityName)?.status
  );
