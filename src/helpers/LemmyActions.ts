import { lemmyAuthToken, lemmyInstance } from "../LemmyInstance";
import { handleLemmyError } from "./LemmyErrorHelper";
import { ILemmyVote } from "../types/lemmy/ILemmyVote";

export const likeComment = async (commentId: number, value: ILemmyVote) => {
  try {
    await lemmyInstance.likeComment({
      auth: lemmyAuthToken,
      comment_id: commentId,
      score: value,
    });
  } catch (e) {
    handleLemmyError(e.toString());
    throw new Error();
  }
};
