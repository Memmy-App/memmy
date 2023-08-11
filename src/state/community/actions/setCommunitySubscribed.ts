import { useCommunityStore } from "@src/state/community/communityStore";
import instance from "@src/Instance";

export const setCommunitySubscribed = async (
  communityName: string
): Promise<void> => {
  let subscribe: boolean;
  let communityId: number;

  const current = useCommunityStore
    .getState()
    .communityStates.get(communityName);

  if (!current) return;

  subscribe = current.community!.subscribed === "NotSubscribed";
  communityId = current.community!.community.id;

  useCommunityStore.setState((state) => {
    const prev = state.communityStates.get(communityName)!;

    subscribe = prev.community!.subscribed === "NotSubscribed";
    communityId = prev.community!.community.id;

    prev.community!.subscribed = subscribe ? "Subscribed" : "NotSubscribed";
  });

  try {
    await instance.subscribeCommunity(communityId, subscribe);
  } catch (e) {
    useCommunityStore.setState((state) => {
      const prev = state.communityStates.get(communityName)!;

      prev.community!.subscribed = !subscribe ? "Subscribed" : "NotSubscribed";
    });
  }
};
