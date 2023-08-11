import { useCommunityStore } from "@src/state/community/communityStore";
import instance from "@src/Instance";

export const loadCommunity = async (
  communityName: string,
  noRefresh = false
): Promise<void> => {
  const current = useCommunityStore
    .getState()
    .communityStates.get(communityName);

  if (
    noRefresh &&
    current &&
    !current.status.loading &&
    !current.status.error
  ) {
    return;
  }

  useCommunityStore.setState((state) => {
    const prev = state.communityStates.get(communityName);

    if (!prev) {
      state.communityStates.set(communityName, {
        community: undefined,
        moderators: [],
        languages: [],

        status: {
          loading: true,
          error: false,
          refreshing: false,
          notFound: false,
        },
      });
    } else {
      prev.status.loading = true;
      prev.status.error = false;
    }
  });

  try {
    const res = await instance.getCommunity(communityName);

    useCommunityStore.setState((state) => {
      const prev = state.communityStates.get(communityName)!;

      if (!res) {
        prev.status.loading = false;
        prev.status.error = true;
      } else {
        prev.community = res.community_view;
        prev.moderators = res.moderators;
        prev.languages = res.discussion_languages;

        prev.status.loading = false;
        prev.status.refreshing = false;
      }
    });
  } catch (e) {
    useCommunityStore.setState((state) => {
      const prev = state.communityStates.get(communityName)!.status;

      prev.loading = false;
      prev.error = true;
      prev.notFound = true; // TODO Check for this explicitly
    });
  }
};
