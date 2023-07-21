import { useCommunitiesStore } from "../communitiesStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const setCommunitySubscribed = async (communityName: string) => {
  let subscribe: boolean;
  let communityId: number;

  useCommunitiesStore.setState((state) => {
    const prev = state.communityStates.get(communityName);

    subscribe = prev.community.subscribed === "NotSubscribed";
    communityId = prev.community.community.id;

    prev.community.subscribed =
      prev.community.subscribed === "NotSubscribed"
        ? "Subscribed"
        : "NotSubscribed";
  });

  try {
    await lemmyInstance.followCommunity({
      auth: lemmyAuthToken,
      community_id: communityId,
      follow: subscribe,
    });
  } catch (e) {
    handleLemmyError(e.toString());

    useCommunitiesStore.setState((state) => {
      const prev = state.communityStates.get(communityName);

      prev.community.subscribed =
        prev.community.subscribed === "NotSubscribed"
          ? "Subscribed"
          : "NotSubscribed";
    });
  }
};

export default setCommunitySubscribed;
