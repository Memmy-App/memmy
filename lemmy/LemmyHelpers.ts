import { CommentView, CommunityView, Person, PostView } from "lemmy-js-client";
import { getBaseUrl } from "../helpers/LinkHelper";
import ILemmyComment from "./types/ILemmyComment";
import { ILemmyVote } from "./types/ILemmyVote";

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

export const removeNsfwPosts = (list: PostView[]) =>
  list.filter((p) => !p.post.nsfw);

export const getCommunityFullName = (community: CommunityView) =>
  `${community.community.name}@${getBaseUrl(community.community.actor_id)}`;

export const getUserFullName = (profile: Person) =>
  `${profile.name}@${getBaseUrl(profile.actor_id)}`;

export const createUserFullName = (name: string, actor: string) =>
  `${name}@${getBaseUrl(actor)}`;

export const buildComments = (comments: CommentView[]) => {
  const betterComments: ILemmyComment[] = [];

  for (const comment of comments) {
    betterComments.push({
      comment,
      myVote: comment.my_vote as ILemmyVote,
      hidden: false,
      collapsed: false,
    });
  }

  return betterComments;
};
