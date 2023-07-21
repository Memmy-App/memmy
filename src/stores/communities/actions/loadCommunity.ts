import { useCommunitiesStore } from "../communitiesStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const loadCommunity = async (communityName: string) => {
  console.log("blah blah");
  useCommunitiesStore.setState((state) => {
    console.log("checking...");

    console.log(communityName);

    if (!state.communityStates.has(communityName)) {
      console.log("nope");
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
      console.log("yup");
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

      prev.status = {
        ...prev.status,
        loading: false,
        refreshing: false,
      };
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
