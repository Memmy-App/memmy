import { useCommunitiesStore } from "../communitiesStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const loadCommunity = async (communityName: string, noRefresh = false) => {
  const current = useCommunitiesStore
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

  useCommunitiesStore.setState((state) => {
    if (!state.communityStates.has(communityName)) {
      state.communityStates.set(communityName, {
        community: null,
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
      const prev = state.communityStates.get(communityName).status;

      prev.loading = true;
      prev.error = false;
    }
  });

  try {
    const res = await lemmyInstance.getCommunity({
      auth: lemmyAuthToken,
      name: communityName,
    });

    useCommunitiesStore.setState((state) => {
      const prev = state.communityStates.get(communityName);

      prev.community = res.community_view;
      prev.moderators = res.moderators;
      prev.languages = res.discussion_languages;

      prev.status.loading = false;
      prev.status.refreshing = false;
    });
  } catch (e) {
    handleLemmyError(e.toString());

    useCommunitiesStore.setState((state) => {
      const prev = state.communityStates.get(communityName).status;

      prev.loading = false;
      prev.error = true;
      prev.notFound = true; // TODO Check for this explicitly
    });
  }
};

export default loadCommunity;
