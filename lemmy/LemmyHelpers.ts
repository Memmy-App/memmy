import { CommunityView, PostView } from "lemmy-js-client";

export const isSubscribed = (
  communityId: number,
  communities: CommunityView[]
): boolean => {
  const res = communities.find((c) => c.community.id === communityId);

  return !!res;
};

export const removeDuplicatePosts = (
  currentList: PostView[],
  newItems: PostView[]
) =>
  newItems.filter(
    (p) => currentList.findIndex((pp) => pp.post.id === p.post.id) === -1
  );
