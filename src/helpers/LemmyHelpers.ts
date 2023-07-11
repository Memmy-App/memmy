import { CommentView, CommunityView, Person, PostView } from "lemmy-js-client";
import { getBaseUrl } from "./LinkHelper";
import { lemmyAuthToken, lemmyInstance } from "../LemmyInstance";
import ILemmyComment from "../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../types/lemmy/ILemmyVote";
import { handleLemmyError } from "./LemmyErrorHelper";

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

export const removeReadPosts = (list: PostView[]) =>
  list.filter((p) => !p.read);

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

export const savePost = async (
  post_id: number,
  save = true
): Promise<boolean> => {
  try {
    await lemmyInstance.savePost({
      auth: lemmyAuthToken,
      post_id,
      save,
    });

    return true;
  } catch (e) {
    handleLemmyError(e.toString());
    return false;
  }
};

export const saveComment = async (
  comment_id: number,
  save = true
): Promise<boolean> => {
  try {
    await lemmyInstance.saveComment({
      auth: lemmyAuthToken,
      comment_id,
      save,
    });

    return true;
  } catch (e) {
    handleLemmyError(e.toString());

    return false;
  }
};
